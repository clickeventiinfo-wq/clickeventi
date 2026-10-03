import { useState, useEffect } from "react";
import {
  Briefcase, MapPin, CalendarDays, Euro, Users, Send, Check, Loader2,
  ArrowLeft, Plus, Clock
} from "lucide-react";
import { supabase } from "./supabase";
import { ComuneInput } from "./comuni.jsx";

/* ============================================================
   CLICK EVENTI — Bacheca lavoro
   clickeventi.it/?bacheca     elenco degli annunci
   clickeventi.it/?pubblica    modulo per le agenzie
   Le agenzie pubblicano (con verifica del team), i professionisti
   approvati si candidano.
   ============================================================ */

const CATEGORIE = [
  { id: "musica", label: "Musica" },
  { id: "foto", label: "Foto & Video" },
  { id: "barman", label: "Beverage" },
  { id: "animazione", label: "Animazione & Spettacolo" },
  { id: "beauty", label: "Hair & Beauty" },
  { id: "altro", label: "Altro" },
];
const catLabel = (id) => CATEGORIE.find((c) => c.id === id)?.label || "";
const dataIt = (s) => s ? new Date(s).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : null;

const Style = () => (
  <style>{`
    :root{--bg:#fff;--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2;--ok:#1E9E6A;--ok-soft:#E7F6EF}
    *{box-sizing:border-box;margin:0;padding:0}
    img{max-width:100%;height:auto}
    .bc-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .bc-display{font-family:'Sora',sans-serif}
    .bc-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center;position:sticky;top:0;z-index:20}
    .bc-wrap{max-width:820px;margin:0 auto;padding:0 20px;width:100%}
    .bc-headin{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .bc-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .bc-logo em{font-style:normal;color:var(--accent)}
    .bc-btn{display:inline-flex;align-items:center;gap:7px;font:600 13.5px 'Work Sans',sans-serif;border-radius:999px;padding:9px 17px;cursor:pointer;border:1px solid var(--accent);background:var(--accent);color:#fff;text-decoration:none}
    .bc-btn:hover{background:#7A5CE8}
    .bc-btn.chiaro{background:#fff;color:var(--ink);border-color:var(--linea)}
    .bc-intro{padding:34px 0 8px}
    .bc-intro h1{font-family:'Sora',sans-serif;font-size:clamp(25px,4.4vw,33px);letter-spacing:-.01em;margin-bottom:8px}
    .bc-intro p{color:var(--grigio);font-size:15.5px;line-height:1.6;max-width:560px}
    .bc-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:22px;margin-bottom:14px}
    .bc-card h3{font-family:'Sora',sans-serif;font-size:18px;margin-bottom:4px}
    .bc-ag{font-size:13.5px;color:var(--grigio);margin-bottom:10px}
    .bc-meta{display:flex;flex-wrap:wrap;gap:13px;font-size:13.5px;color:var(--grigio);margin-bottom:12px}
    .bc-meta span{display:inline-flex;align-items:center;gap:6px}
    .bc-tag{display:inline-block;background:var(--accent-soft);color:var(--accent);border-radius:999px;font-size:12px;font-weight:600;padding:3px 10px}
    .bc-desc{font-size:14.5px;line-height:1.65;color:#3A3552;white-space:pre-wrap;margin-bottom:14px}
    .bc-comp{display:inline-flex;align-items:center;gap:6px;background:var(--ok-soft);color:var(--ok);border-radius:10px;padding:7px 12px;font-size:14px;font-weight:600;margin-bottom:14px}
    .bc-vuoto{background:#fff;border:1px dashed var(--linea);border-radius:16px;padding:44px 24px;text-align:center;color:var(--grigio)}
    .bc-center{text-align:center;padding:70px 20px;color:var(--grigio)}
    label{display:block;font-size:13px;font-weight:600;margin:14px 0 6px}
    input,select,textarea{width:100%;border:1px solid var(--linea);border-radius:10px;font:500 14px 'Work Sans',sans-serif;padding:11px 12px;background:#fff;color:var(--ink);outline-color:var(--accent)}
    .bc-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .bc-err{color:#C0392B;font-size:13px;margin-top:12px;font-weight:600}
    .bc-hint{font-size:12.5px;color:var(--grigio);margin-top:6px;line-height:1.5}
    .bc-ok{text-align:center;padding:30px 10px}
    .bc-ok svg{color:var(--accent);margin-bottom:14px}
    .bc-spin{animation:bc-rot 1s linear infinite}@keyframes bc-rot{to{transform:rotate(360deg)}}
    .bc-avviso{background:var(--accent-soft);border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.55;color:#3A3552;margin-bottom:16px}
    @media(max-width:560px){.bc-row{grid-template-columns:1fr}}
  `}</style>
);

const Testata = ({ azione }) => (
  <header className="bc-head">
    <div className="bc-wrap bc-headin">
      <a href="/" className="bc-logo">Click<em>Eventi</em></a>
      {azione}
    </div>
  </header>
);

/* ---------------- ELENCO ANNUNCI ---------------- */
export function Bacheca() {
  const [annunci, setAnnunci] = useState([]);
  const [caricando, setCaricando] = useState(true);
  const [aperto, setAperto] = useState(null);
  const [profilo, setProfilo] = useState(null);   // fornitore collegato
  const [messaggio, setMessaggio] = useState("");
  const [esito, setEsito] = useState({});
  const [inviando, setInviando] = useState(false);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("annunci_pubblici");
      setAnnunci(Array.isArray(data) ? data : []);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: f } = await supabase.from("fornitori")
          .select("id, nome, stato").eq("user_id", session.user.id).maybeSingle();
        setProfilo(f || null);
      }
      setCaricando(false);
    })();
  }, []);

  const candidati = async (a) => {
    setInviando(true);
    const { data, error } = await supabase.rpc("candidati", {
      p_annuncio_id: a.id, p_messaggio: messaggio || null,
    });
    setInviando(false);
    if (error) { setEsito({ [a.id]: "Non è stato possibile inviare la candidatura." }); return; }
    if (!data?.ok) { setEsito({ [a.id]: data?.errore || "Qualcosa è andato storto." }); return; }
    setEsito({ [a.id]: "ok" });
    setAperto(null); setMessaggio("");
  };

  const lista = filtro ? annunci.filter((a) => a.categoria === filtro) : annunci;

  return (
    <div className="bc-root"><Style />
      <Testata azione={<a href="/?pubblica" className="bc-btn"><Plus size={15} /> Pubblica un annuncio</a>} />

      <div className="bc-wrap">
        <div className="bc-intro">
          <h1 className="bc-display">Annunci per eventi</h1>
          <p>
            Cerchi un professionista per una data precisa? Pubblica il tuo annuncio
            e ricevi le candidature.
          </p>
        </div>

        {!caricando && annunci.length > 0 && (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "18px 0 20px" }}>
            <button className={"bc-btn " + (filtro ? "chiaro" : "")} onClick={() => setFiltro("")}>Tutti</button>
            {CATEGORIE.filter((c) => annunci.some((a) => a.categoria === c.id)).map((c) => (
              <button key={c.id} className={"bc-btn " + (filtro === c.id ? "" : "chiaro")}
                      onClick={() => setFiltro(filtro === c.id ? "" : c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        {caricando ? (
          <div className="bc-center"><Loader2 size={26} className="bc-spin" /></div>
        ) : lista.length === 0 ? (
          <div className="bc-vuoto">
            <Briefcase size={28} style={{ marginBottom: 10, opacity: .5 }} />
            <p style={{ marginBottom: 6, fontWeight: 600, color: "var(--ink)" }}>
              Al momento non ci sono annunci
            </p>
            <p style={{ fontSize: 14 }}>
              Stai organizzando un evento e cerchi un professionista?{" "}
              <a href="/?pubblica" style={{ color: "var(--accent)", fontWeight: 600 }}>Pubblica un annuncio</a>.
            </p>
          </div>
        ) : (
          lista.map((a) => (
            <div key={a.id} className="bc-card">
              {a.categoria && <span className="bc-tag">{catLabel(a.categoria)}</span>}
              <h3 className="bc-display" style={{ marginTop: a.categoria ? 10 : 0 }}>{a.titolo}</h3>
              <p className="bc-ag">{a.agenzia}</p>

              <div className="bc-meta">
                {a.localita && <span><MapPin size={14} /> {a.localita}{a.provincia ? ` (${a.provincia})` : ""}</span>}
                {a.data_evento && <span><CalendarDays size={14} /> {dataIt(a.data_evento)}</span>}
                {a.scadenza && <span><Clock size={14} /> candidature entro il {dataIt(a.scadenza)}</span>}
                {a.candidature > 0 && <span><Users size={14} /> {a.candidature} candidat{a.candidature === 1 ? "o" : "i"}</span>}
              </div>

              {a.compenso && <div className="bc-comp"><Euro size={15} /> {a.compenso}</div>}

              <p className="bc-desc">{a.descrizione}</p>

              {esito[a.id] === "ok" ? (
                <div className="bc-comp" style={{ marginBottom: 0 }}>
                  <Check size={15} /> Candidatura inviata — l'agenzia ha ricevuto i tuoi contatti
                </div>
              ) : aperto === a.id ? (
                <div>
                  <label>Due righe di presentazione (facoltative)</label>
                  <textarea rows={3} value={messaggio} onChange={(e) => setMessaggio(e.target.value)}
                            placeholder="Es. suono l'arpa da dieci anni e ho già lavorato in eventi simili" />
                  {esito[a.id] && esito[a.id] !== "ok" && <div className="bc-err">{esito[a.id]}</div>}
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button className="bc-btn" onClick={() => candidati(a)} disabled={inviando}>
                      {inviando ? <><Loader2 size={15} className="bc-spin" /> Invio…</> : <><Send size={15} /> Invia candidatura</>}
                    </button>
                    <button className="bc-btn chiaro" onClick={() => { setAperto(null); setEsito({}); }}>Annulla</button>
                  </div>
                </div>
              ) : profilo?.stato === "approvato" ? (
                <button className="bc-btn" onClick={() => { setAperto(a.id); setEsito({}); }}>
                  <Send size={15} /> Candidati
                </button>
              ) : profilo ? (
                <div className="bc-avviso">
                  Il tuo profilo è ancora in verifica: potrai candidarti appena sarà pubblicato.
                </div>
              ) : (
                <div className="bc-avviso">
                  Per candidarti serve un profilo pubblicato su Click Eventi.{" "}
                  <a href="/?iscrizione" style={{ color: "var(--accent)", fontWeight: 600 }}>Crea il tuo profilo</a>
                  {" "}oppure{" "}
                  <a href={`/?accedi&ritorno=${encodeURIComponent("/?bacheca")}`}
                     style={{ color: "var(--accent)", fontWeight: 600 }}>accedi</a>.
                </div>
              )}
            </div>
          ))
        )}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/* ---------------- MODULO PER LE AGENZIE ---------------- */
export function PubblicaAnnuncio() {
  const [d, setD] = useState({
    agenzia: "", email: "", telefono: "", titolo: "", descrizione: "",
    categoria: "", data_evento: "", scadenza: "", compenso: "",
  });
  const [comune, setComune] = useState(null);
  const [errore, setErrore] = useState("");
  const [inviando, setInviando] = useState(false);
  const [fatto, setFatto] = useState(false);
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });

  const invia = async () => {
    setErrore("");
    if (!d.agenzia.trim()) { setErrore("Indica il nome dell'agenzia."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email.trim())) { setErrore("Inserisci un indirizzo e-mail valido."); return; }
    if (!d.titolo.trim()) { setErrore("Scrivi un titolo per l'annuncio."); return; }
    if (d.descrizione.trim().length < 30) { setErrore("Descrivi la ricerca in modo un po' più completo (almeno 30 caratteri)."); return; }

    setInviando(true);
    const { data, error } = await supabase.rpc("pubblica_annuncio", {
      p_agenzia_nome: d.agenzia, p_agenzia_email: d.email, p_agenzia_telefono: d.telefono || null,
      p_titolo: d.titolo, p_descrizione: d.descrizione,
      p_categoria: d.categoria || null,
      p_localita: comune?.name || null, p_provincia: comune?.area || null,
      p_lat: comune?.lat ?? null, p_lng: comune?.lng ?? null,
      p_data_evento: d.data_evento || null, p_scadenza: d.scadenza || null,
      p_compenso: d.compenso || null,
    });
    setInviando(false);
    if (error) { setErrore("Non è stato possibile inviare l'annuncio. Riprova."); return; }
    if (!data?.ok) { setErrore(data?.errore || "Qualcosa è andato storto."); return; }
    setFatto(true);
  };

  if (fatto) {
    return (
      <div className="bc-root"><Style />
        <Testata azione={<a href="/?bacheca" className="bc-btn chiaro">Vedi la bacheca</a>} />
        <div className="bc-wrap" style={{ maxWidth: 560 }}>
          <div className="bc-card bc-ok" style={{ marginTop: 34 }}>
            <Check size={42} />
            <h1 className="bc-display" style={{ fontSize: 23, marginBottom: 8 }}>Annuncio ricevuto</h1>
            <p style={{ color: "var(--grigio)", fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
              Lo verifichiamo e, se è tutto in ordine, lo pubblichiamo sulla bacheca.
              Ti avvisiamo a <b>{d.email}</b>, dove riceverai anche le candidature.
            </p>
            <a href="/?bacheca" className="bc-btn" style={{ marginTop: 20 }}>Vai alla bacheca</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bc-root"><Style />
      <Testata azione={<a href="/?bacheca" className="bc-btn chiaro"><ArrowLeft size={15} /> Bacheca</a>} />
      <div className="bc-wrap" style={{ maxWidth: 620 }}>
        <div className="bc-intro">
          <h1 className="bc-display">Pubblica il tuo annuncio</h1>
          <p>
            Descrivi che professionista ti serve e per quale data: i professionisti iscritti
            a Click Eventi potranno candidarsi. Le candidature arrivano alla tua email.
          </p>
        </div>

        <div className="bc-card">
          <div className="bc-row">
            <div><label>Nome o ragione sociale *</label><input value={d.agenzia} onChange={set("agenzia")} placeholder="Come vuoi comparire nell&apos;annuncio" /></div>
            <div><label>Email *</label><input type="email" value={d.email} onChange={set("email")} placeholder="Dove ricevere le candidature" /></div>
          </div>
          <label>Telefono (facoltativo)</label>
          <input value={d.telefono} onChange={set("telefono")} />

          <label>Titolo dell'annuncio *</label>
          <input value={d.titolo} onChange={set("titolo")} placeholder="Es. Cerchiamo DJ per matrimonio in Salento" />

          <label>Che figura cerchi</label>
          <select value={d.categoria} onChange={set("categoria")}>
            <option value="">Seleziona una categoria</option>
            {CATEGORIE.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          <label>Descrizione *</label>
          <textarea rows={5} value={d.descrizione} onChange={set("descrizione")}
                    placeholder="Racconta cosa serve: tipo di evento, orari, cosa deve portare il professionista, requisiti particolari…" />
          <p className="bc-hint">Più sei precisa, meno candidature fuori bersaglio riceverai.</p>

          <label>Comune dell'evento</label>
          <ComuneInput valore={comune?.name} onChange={setComune} />

          <div className="bc-row">
            <div><label>Data dell'evento</label><input type="date" value={d.data_evento} onChange={set("data_evento")} /></div>
            <div><label>Candidature entro il</label><input type="date" value={d.scadenza} onChange={set("scadenza")} /></div>
          </div>

          <label>Compenso (facoltativo)</label>
          <input value={d.compenso} onChange={set("compenso")} placeholder="Es. 250 € per la serata, oppure da concordare" />
          <p className="bc-hint">Indicarlo aumenta molto le candidature ricevute.</p>

          {errore && <div className="bc-err">{errore}</div>}

          <button className="bc-btn" style={{ marginTop: 20, width: "100%", justifyContent: "center", padding: 13 }}
                  onClick={invia} disabled={inviando}>
            {inviando ? <><Loader2 size={16} className="bc-spin" /> Invio…</> : <><Send size={16} /> Pubblica l'annuncio</>}
          </button>
          <p className="bc-hint" style={{ textAlign: "center", marginTop: 10 }}>
            Ogni annuncio viene verificato dal team prima di comparire in bacheca.
          </p>
        </div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
