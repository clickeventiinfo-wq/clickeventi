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
    .pr-storico{border-top:1px solid var(--linea);margin-top:18px;padding-top:16px}
    .pr-storico h5{font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--grigio);margin-bottom:12px}
    .pr-riga{display:flex;gap:10px;margin-bottom:12px}
    .pr-bolla{flex:1;border-radius:12px;padding:10px 13px;font-size:14px;line-height:1.5}
    .pr-bolla.forn{background:var(--accent-soft)}
    .pr-bolla.cli{background:var(--bg2)}
    .pr-bolla b{display:block;font-size:12.5px;color:var(--grigio);font-weight:600;margin-bottom:3px}
    .pr-bolla .pr-imp{font-family:'Sora',sans-serif;font-weight:700;font-size:15px;color:var(--ink)}
    .pr-campo{width:100%;border:1px solid var(--linea);border-radius:11px;font:500 14.5px 'Work Sans',sans-serif;padding:11px 12px;background:#fff;color:var(--ink);outline-color:var(--accent)}
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
  const [rilancio, setRilancio] = useState(false);
  const [mioPrezzo, setMioPrezzo] = useState("");
  const [mioMessaggio, setMioMessaggio] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("proposta_da_token", { p_token: token });
      if (error || !data?.ok) { setStato("errore"); setErrore("Questo link non è valido o è scaduto."); return; }
      setDati(data);
      if (data.stato === "accettata" || data.stato === "rifiutata") {
        setEsito(data.stato === "accettata");
        setStato("conclusa");
        return;
      }
      if (data.turno !== "cliente") { setStato("attesa"); return; }
      setStato("form");
    })();
  }, [token]);

  const rispondi = async (azione) => {
    setErrore("");
    if (azione === "rilancia") {
      const n = Number(mioPrezzo);
      if (!n || n <= 0) { setErrore("Indica l'importo che proponi."); return; }
    }
    setSaving(true);
    const { data, error } = await supabase.rpc("rispondi_proposta", {
      p_token: token, p_azione: azione,
      p_prezzo: azione === "rilancia" ? Number(mioPrezzo) : null,
      p_messaggio: mioMessaggio || null,
    });
    setSaving(false);
    if (error) { setErrore("Non è stato possibile registrare la risposta. Riprova."); return; }
    if (!data?.ok) { setErrore(data?.errore || "Qualcosa è andato storto."); return; }
    if (azione === "rilancia") { setStato("inviata"); return; }
    if (azione === "accetta") {
      const { data: aggiornati } = await supabase.rpc("proposta_da_token", { p_token: token });
      if (aggiornati?.ok) setDati(aggiornati);
    }
    setEsito(azione === "accetta"); setStato("conclusa");
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

        {stato === "attesa" && (
          <div className="pr-card pr-ok">
            <Loader2 size={38} className="pr-spin" />
            <h1 style={{ marginTop: 12 }}>In attesa di risposta</h1>
            <p className="pr-sub" style={{ marginTop: 8 }}>
              Abbiamo inviato la tua proposta a {dati?.fornitore || "il professionista"}.
              Ti avvisiamo per email appena risponde.
            </p>
            <a href="/" className="pr-btn ok">Torna al sito</a>
          </div>
        )}

        {stato === "inviata" && (
          <div className="pr-card pr-ok">
            <Check size={42} />
            <h1>Proposta inviata</h1>
            <p className="pr-sub" style={{ marginTop: 8 }}>
              Abbiamo girato la tua proposta a {dati?.fornitore || "il professionista"}:
              ti avvisiamo per email appena risponde.
            </p>
            <a href="/" className="pr-btn ok">Torna al sito</a>
          </div>
        )}

        {stato === "conclusa" && (
          <div className="pr-card pr-ok">
            {esito ? <PartyPopper size={42} /> : <Check size={42} />}
            <h1>{esito ? "Proposta accettata" : "Risposta registrata"}</h1>
            <p className="pr-sub" style={{ marginTop: 8 }}>
              {esito
                ? <>L'accordo con {dati?.fornitore || "il professionista"} è confermato. Ti abbiamo inviato il riepilogo per email.</>
                : <>Abbiamo comunicato la tua risposta. Se vuoi, puoi cercare altri professionisti per il tuo evento.</>}
            </p>

            {esito && (dati?.email_fornitore || dati?.telefono_fornitore) && (
              <div style={{ background: "var(--accent-soft)", borderRadius: 12, padding: 16, margin: "16px 0", textAlign: "left" }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                  Contatti di {dati.fornitore}
                </p>
                {dati.email_fornitore && (
                  <p style={{ fontSize: 14.5, marginBottom: 4 }}>
                    Email: <a href={`mailto:${dati.email_fornitore}`} style={{ color: "var(--accent)", fontWeight: 600 }}>{dati.email_fornitore}</a>
                  </p>
                )}
                {dati.telefono_fornitore && (
                  <p style={{ fontSize: 14.5 }}>
                    Telefono: <a href={`tel:${dati.telefono_fornitore.replace(/\s/g, "")}`} style={{ color: "var(--accent)", fontWeight: 600 }}>{dati.telefono_fornitore}</a>
                  </p>
                )}
              </div>
            )}
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

            {dati.storico?.length > 1 && (
              <div className="pr-storico">
                <h5>Come è andata finora</h5>
                {dati.storico.map((t, i) => (
                  <div className="pr-riga" key={i}>
                    <div className={"pr-bolla " + (t.autore === "fornitore" ? "forn" : "cli")}>
                      <b>{t.autore === "fornitore" ? dati.fornitore : "La tua proposta"}</b>
                      {t.prezzo ? <span className="pr-imp">{t.prezzo} €</span> : null}
                      {t.messaggio ? <div style={{ marginTop: 3 }}>{t.messaggio}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errore && <div className="pr-err">{errore}</div>}

            {!rilancio ? (
              <>
                <button className="pr-btn ok" onClick={() => rispondi("accetta")} disabled={saving}>
                  {saving ? <><Loader2 size={17} className="pr-spin" /> Attendere…</> : <><Check size={17} /> Accetto la proposta</>}
                </button>
                {dati.puo_rilanciare && (
                  <button className="pr-btn" onClick={() => { setRilancio(true); setMioPrezzo(dati.nuovo_prezzo || ""); }} disabled={saving}>
                    Propongo un altro importo
                  </button>
                )}
                <button className="pr-btn" onClick={() => rispondi("rifiuta")} disabled={saving}>
                  <X size={17} /> Non mi interessa
                </button>
                <p className="pr-nota">
                  Accettando, il professionista verrà avvisato e ti contatterà per definire gli ultimi dettagli.
                </p>
              </>
            ) : (
              <div style={{ marginTop: 6 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "14px 0 6px" }}>
                  Quanto proponi (€)
                </label>
                <input className="pr-campo" type="number" value={mioPrezzo}
                       onChange={(e) => setMioPrezzo(e.target.value)} placeholder="Es. 270" />
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "14px 0 6px" }}>
                  Vuoi spiegare il motivo? (facoltativo)
                </label>
                <textarea className="pr-campo" rows={3} value={mioMessaggio}
                          onChange={(e) => setMioMessaggio(e.target.value)}
                          placeholder="Es. l'evento finisce prima del previsto, servono due ore invece di tre" />
                <button className="pr-btn ok" onClick={() => rispondi("rilancia")} disabled={saving}>
                  {saving ? <><Loader2 size={17} className="pr-spin" /> Invio…</> : <>Invia la mia proposta</>}
                </button>
                <button className="pr-btn" onClick={() => setRilancio(false)} disabled={saving}>Annulla</button>
                <p className="pr-nota">
                  Potete scambiarvi ancora {dati.scambi_rimasti} propost{dati.scambi_rimasti === 1 ? "a" : "e"}:
                  dopo resteranno solo accetta o rifiuta.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
