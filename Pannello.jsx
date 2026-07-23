import { useState } from "react";
import {
  Music, MapPin, Star, Check, X, CalendarDays, Clock, Users, Euro,
  Camera, Navigation, Inbox, Package, User, TrendingUp, AlertCircle, Plus
} from "lucide-react";

/* ============================================================
   CLICK EVENTI — Pannello Fornitore (prototipo demo)
   Vista di esempio: Elisa Quaranta, violinista.
   In v1 il caricamento è gestito dal team Click Eventi;
   questo pannello è la demo di come il fornitore gestirà
   richieste, calendario, pacchetti e fasce di distanza.
   ============================================================ */

const INITIAL_REQUESTS = [
  {
    id: 1, cliente: "Marco B.", evento: "Matrimonio", data: "12 settembre 2026",
    luogo: "Ostuni (BR)", pacchetto: "Cerimonia & Aperitivo", ore: 3,
    extra: ["Amplificazione professionale"], totale: 620, stato: "nuova",
    nota: "Cerimonia in masseria alle 17, aperitivo a seguire in giardino.",
  },
  {
    id: 2, cliente: "Francesca T.", evento: "Evento aziendale", data: "3 ottobre 2026",
    luogo: "Bari (BA)", pacchetto: "Set acustico", ore: 2,
    extra: ["Brani su richiesta"], totale: 570, stato: "nuova",
    nota: "Cena di gala aziendale, ~80 ospiti. Preferenza repertorio italiano.",
  },
  {
    id: 3, cliente: "Giulia R.", evento: "Festa privata", data: "26 luglio 2026",
    luogo: "Lecce (LE)", pacchetto: "Set acustico", ore: 1,
    extra: [], totale: 150, stato: "accettata",
    nota: "Festa di anniversario dei miei genitori, in villa privata.",
  },
];

const EVENT_OPTS = ["Ogni evento", "Compleanno", "18esimo", "Festa privata", "Laurea", "Evento aziendale", "Matrimonio"];

/* scaleOn: "fisso" | "ore" | "ospiti" | "persone" */
const SCALE_OPTS = [
  { id: "fisso", label: "Prezzo fisso (la quantità non incide)" },
  { id: "ore", label: "A ore", unit: "ora", inclLabel: "Ore incluse nel prezzo base", extraLabel: "€ per ora aggiuntiva" },
  { id: "ospiti", label: "A numero di ospiti", unit: "ospite", inclLabel: "Ospiti inclusi nel prezzo base", extraLabel: "€ per ospite in più" },
  { id: "persone", label: "A persona (es. trucco)", unit: "persona", inclLabel: "Persone incluse nel prezzo base", extraLabel: "€ per persona in più" },
];
const scaleOpt = (id) => SCALE_OPTS.find((s) => s.id === id);

const INITIAL_PACKAGES = [
  { id: "p1", label: "Cerimonia & Aperitivo", event: "Matrimonio", base: 350,
    includes: "Cerimonia + aperitivo · Repertorio concordato · Sopralluogo incluso",
    scaleOn: "ore", included: 2, extra: 120 },
  { id: "p2", label: "Set acustico", event: "Ogni evento", base: 150,
    includes: "1 ora di esibizione · Playlist su misura",
    scaleOn: "ore", included: 1, extra: 120 },
];

const INITIAL_EXTRAS = [
  { id: "e1", label: "Amplificazione professionale", price: 50 },
  { id: "e2", label: "Brani su richiesta", price: 100 },
  { id: "e3", label: "Quartetto d'archi", price: 400 },
];

const INITIAL_FASCE = [
  { id: 1, label: "Entro 30 km", fee: 0 },
  { id: 2, label: "Entro 100 km", fee: 100 },
  { id: 3, label: "Oltre 100 km", fee: 150 },
];

const INITIAL_BUSY = [4, 11, 18, 25];

const MESE = "Settembre 2026";
const GIORNI = ["L", "M", "M", "G", "V", "S", "D"];
/* settembre 2026: 1 = martedì → offset 1 */
const OFFSET = 1;
const NUM_GIORNI = 30;

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root {
      --bg: #FFFFFF; --bg2: #FAF9F7; --ink: #23203A;
      --accent: #8B6EF3; --accent-soft: #F3EFFE;
      --grigio: #6E6A80; --linea: #ECE9E2;
      --ok: #1E9E6A; --ok-soft: #E7F6EF;
      --warn: #C77E1F; --warn-soft: #FBF2E2;
      --ombra: 0 10px 30px rgba(35,32,58,0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .fp-root { font-family: 'Work Sans', system-ui, sans-serif; background: var(--bg2); color: var(--ink); min-height: 100vh; -webkit-font-smoothing: antialiased; }
    .fp-display { font-family: 'Sora', sans-serif; }
    .fp-container { max-width: 1040px; margin: 0 auto; padding: 0 20px; }
    .fp-card { background: var(--bg); border: 1px solid var(--linea); border-radius: 16px; }

    .fp-header { background: var(--bg); border-bottom: 1px solid var(--linea); position: sticky; top: 0; z-index: 50; }
    .fp-header-in { display: flex; align-items: center; justify-content: space-between; height: 60px; }
    .fp-logo { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 19px; }
    .fp-logo em { font-style: normal; color: var(--accent); }
    .fp-logo small { font-weight: 600; color: var(--grigio); font-size: 12px; margin-left: 8px; }
    .fp-me { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; }
    .fp-avatar {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--accent-soft); color: var(--accent);
      font: 700 14px 'Sora', sans-serif;
      display: flex; align-items: center; justify-content: center;
    }

    .fp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
    .fp-stat { padding: 16px 18px; }
    .fp-stat b { font-family: 'Sora', sans-serif; font-size: 24px; display: block; }
    .fp-stat span { font-size: 12.5px; color: var(--grigio); font-weight: 600; }
    .fp-stat svg { color: var(--accent); margin-bottom: 8px; }

    .fp-tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
    .fp-tab {
      display: inline-flex; align-items: center; gap: 7px;
      font: 600 13.5px 'Work Sans', sans-serif; color: var(--grigio);
      background: var(--bg); border: 1px solid var(--linea); border-radius: 999px;
      padding: 9px 16px; cursor: pointer;
    }
    .fp-tab.on { background: var(--ink); color: #fff; border-color: var(--ink); }
    .fp-badge {
      background: var(--accent); color: #fff; border-radius: 999px;
      font-size: 11px; font-weight: 700; padding: 1px 7px;
    }

    .fp-req { padding: 18px 20px; margin-bottom: 12px; }
    .fp-req-head { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; flex-wrap: wrap; }
    .fp-req-head h4 { font-family: 'Sora', sans-serif; font-size: 16px; }
    .fp-req-tot { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; }
    .fp-req-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: var(--grigio); margin: 8px 0 10px; }
    .fp-req-meta span { display: inline-flex; align-items: center; gap: 5px; }
    .fp-req-nota { font-size: 13.5px; background: var(--bg2); border-radius: 10px; padding: 10px 12px; margin-bottom: 12px; }
    .fp-req-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .fp-btn {
      display: inline-flex; align-items: center; gap: 7px;
      font: 600 13.5px 'Work Sans', sans-serif;
      border-radius: 10px; padding: 9px 16px; cursor: pointer; border: 1px solid var(--linea); background: var(--bg); color: var(--ink);
    }
    .fp-btn.ok { background: var(--accent); border-color: var(--accent); color: #fff; }
    .fp-btn.ok:hover { background: #7A5CE8; }
    .fp-btn:hover { border-color: var(--ink); }
    .fp-pill { font-size: 12px; font-weight: 700; border-radius: 999px; padding: 3px 10px; }
    .fp-pill.nuova { background: var(--accent-soft); color: var(--accent); }
    .fp-pill.accettata { background: var(--ok-soft); color: var(--ok); }
    .fp-pill.rifiutata { background: #F6E7E7; color: #B44848; }
    .fp-pill.contro { background: var(--warn-soft); color: var(--warn); }

    .fp-cal { padding: 20px; }
    .fp-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-top: 14px; }
    .fp-cal-dow { font-size: 11.5px; font-weight: 700; color: var(--grigio); text-align: center; padding-bottom: 4px; }
    .fp-day {
      aspect-ratio: 1; border: 1px solid var(--linea); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 13.5px; cursor: pointer; background: var(--bg);
    }
    .fp-day:hover { border-color: var(--ink); }
    .fp-day.busy { background: var(--ink); color: #fff; border-color: var(--ink); }
    .fp-day.empty { border: none; cursor: default; background: transparent; }
    .fp-legend { display: flex; gap: 16px; font-size: 12.5px; color: var(--grigio); margin-top: 12px; }
    .fp-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 4px; margin-right: 6px; vertical-align: -1px; }

    .fp-pkg { padding: 16px 18px; margin-bottom: 10px; }
    .fp-pkg-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; }
    .fp-pkg-head b { font-family: 'Sora', sans-serif; font-size: 15.5px; }
    .fp-pkg-event { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--accent); display: block; }
    .fp-pkg small { color: var(--grigio); font-size: 12.5px; display: block; margin: 4px 0 10px; }
    .fp-price-edit { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13px; }
    .fp-price-edit input {
      width: 84px; border: 1px solid var(--linea); border-radius: 8px;
      font: 600 14px 'Work Sans', sans-serif; padding: 7px 10px; color: var(--ink);
      outline-color: var(--accent);
    }
    .fp-hint {
      display: flex; gap: 10px; align-items: flex-start;
      background: var(--warn-soft); border-radius: 12px; padding: 12px 14px;
      font-size: 13px; color: var(--warn); margin-top: 14px;
    }
    .fp-hint svg { flex-shrink: 0; margin-top: 1px; }

    .fp-photos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 8px; }
    .fp-photo {
      aspect-ratio: 1; border-radius: 12px; border: 1px dashed var(--linea);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 6px; color: var(--grigio); font-size: 11px; text-align: center; background: var(--bg2);
      cursor: pointer;
    }
    .fp-photo.pending { border-style: solid; border-color: var(--warn); color: var(--warn); background: var(--warn-soft); }
    .fp-photo.approved { border-style: solid; border-color: var(--ok); color: var(--ok); background: var(--ok-soft); }
    .fp-form label { display: block; font-size: 13px; font-weight: 600; margin: 13px 0 5px; }
    .fp-form textarea, .fp-form input {
      width: 100%; border: 1px solid var(--linea); border-radius: 10px;
      font: 500 14px 'Work Sans', sans-serif; padding: 10px 12px;
      background: var(--bg); color: var(--ink); outline-color: var(--accent);
    }
    .fp-note { font-size: 12px; color: var(--grigio); margin-top: 8px; }

    @media (max-width: 820px) {
      .fp-stats { grid-template-columns: 1fr 1fr; }
      .fp-photos { grid-template-columns: repeat(2, 1fr); }
    }
  `}</style>
);

/* ---------- sezioni ---------- */

function Richieste({ requests, setRequests }) {
  const [counterFor, setCounterFor] = useState(null);
  const [counter, setCounter] = useState({ prezzo: "", msg: "" });

  const act = (id, stato, extra = {}) =>
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, stato, ...extra } : r)));

  const openCounter = (r) => {
    setCounterFor(r.id);
    setCounter({ prezzo: r.totale, msg: "" });
  };
  const sendCounter = (r) => {
    act(r.id, "controproposta", { contro: { prezzo: Number(counter.prezzo) || r.totale, msg: counter.msg } });
    setCounterFor(null);
  };

  return (
    <div>
      {requests.map((r) => (
        <div key={r.id} className="fp-req fp-card">
          <div className="fp-req-head">
            <h4 className="fp-display">{r.evento} · {r.cliente}</h4>
            <span className="fp-req-tot">{r.totale} €</span>
          </div>
          <div className="fp-req-meta">
            <span><CalendarDays size={13} /> {r.data}</span>
            <span><MapPin size={13} /> {r.luogo}</span>
            <span><Package size={13} /> {r.pacchetto} · {r.ore}h</span>
            {r.extra.length > 0 && <span><Plus size={13} /> {r.extra.join(", ")}</span>}
          </div>
          <div className="fp-req-nota">"{r.nota}"</div>

          {r.stato === "nuova" && counterFor !== r.id && (
            <div className="fp-req-actions">
              <button className="fp-btn ok" onClick={() => act(r.id, "accettata")}>
                <Check size={15} /> Accetta richiesta
              </button>
              <button className="fp-btn" onClick={() => openCounter(r)}>
                <Euro size={15} /> Proponi modifica
              </button>
              <button className="fp-btn" onClick={() => act(r.id, "rifiutata")}>
                <X size={15} /> Non disponibile
              </button>
            </div>
          )}

          {r.stato === "nuova" && counterFor === r.id && (
            <div className="fp-form" style={{ borderTop: "1px dashed var(--linea)", paddingTop: 4 }}>
              <label htmlFor={"c-prezzo-" + r.id}>La tua controproposta (€)</label>
              <input id={"c-prezzo-" + r.id} type="number" value={counter.prezzo}
                     onChange={(e) => setCounter({ ...counter, prezzo: e.target.value })} />
              <label htmlFor={"c-msg-" + r.id}>Messaggio per il cliente</label>
              <textarea id={"c-msg-" + r.id} rows={2} value={counter.msg}
                        placeholder="Es. per quella data posso solo dalle 19: propongo 2 ore invece di 3 a…"
                        onChange={(e) => setCounter({ ...counter, msg: e.target.value })} />
              <div className="fp-req-actions" style={{ marginTop: 10 }}>
                <button className="fp-btn ok" onClick={() => sendCounter(r)}>
                  <Check size={15} /> Invia controproposta
                </button>
                <button className="fp-btn" onClick={() => setCounterFor(null)}>Annulla</button>
              </div>
            </div>
          )}

          {r.stato === "accettata" && (
            <span className="fp-pill accettata">✓ Accettata — il team avvisa il cliente</span>
          )}
          {r.stato === "rifiutata" && <span className="fp-pill rifiutata">Rifiutata</span>}
          {r.stato === "controproposta" && (
            <div>
              <span className="fp-pill contro">↔ Controproposta inviata: {r.contro.prezzo} €</span>
              {r.contro.msg && <div className="fp-req-nota" style={{ marginTop: 8 }}>Tuo messaggio: "{r.contro.msg}"</div>}
              <p className="fp-note">Il team Click Eventi la gira al cliente: se accetta, l'evento è confermato al nuovo prezzo.</p>
            </div>
          )}
        </div>
      ))}
      <p className="fp-note">
        Le richieste arrivano dal team Click Eventi con il preventivo già calcolato sul tuo listino.
        Puoi accettare, proporre una modifica o segnalare che non sei disponibile.
      </p>
    </div>
  );
}

function Calendario({ busy, setBusy }) {
  const toggle = (d) =>
    setBusy((b) => (b.includes(d) ? b.filter((x) => x !== d) : [...b, d]));
  const cells = [...Array(OFFSET).fill(null), ...Array.from({ length: NUM_GIORNI }, (_, i) => i + 1)];

  return (
    <div className="fp-cal fp-card">
      <h4 className="fp-display" style={{ fontSize: 17 }}>{MESE}</h4>
      <div className="fp-cal-grid">
        {GIORNI.map((g, i) => <div key={i} className="fp-cal-dow">{g}</div>)}
        {cells.map((d, i) =>
          d === null ? (
            <div key={"e" + i} className="fp-day empty" />
          ) : (
            <div key={d} className={"fp-day" + (busy.includes(d) ? " busy" : "")}
                 onClick={() => toggle(d)} role="button" tabIndex={0}
                 onKeyDown={(e) => e.key === "Enter" && toggle(d)}>
              {d}
            </div>
          )
        )}
      </div>
      <div className="fp-legend">
        <span><i style={{ background: "var(--bg)", border: "1px solid var(--linea)" }} /> Libero</span>
        <span><i style={{ background: "var(--ink)" }} /> Occupato (tocca per cambiare)</span>
      </div>
      <div className="fp-hint">
        <AlertCircle size={16} />
        <span>
          I giorni occupati non compaiono nelle ricerche dei clienti.
          In arrivo: sincronizzazione automatica con Google Calendar, così non dovrai aggiornare nulla a mano.
        </span>
      </div>
    </div>
  );
}

function Pacchetti({ packages, setPackages, fasce, setFasce, extras, setExtras }) {
  const [building, setBuilding] = useState(false);
  const [draft, setDraft] = useState({
    label: "", event: "Ogni evento", includes: "", base: "",
    scaleOn: "fisso", included: "", extra: "",
  });
  const [newExtra, setNewExtra] = useState({ label: "", price: "" });

  const upPkg = (id, field, val) =>
    setPackages((ps) => ps.map((p) => (p.id === id ? { ...p, [field]: Number(val) || 0 } : p)));
  const delPkg = (id) => setPackages((ps) => ps.filter((p) => p.id !== id));
  const upFascia = (id, val) =>
    setFasce((fs) => fs.map((f) => (f.id === id ? { ...f, fee: Number(val) || 0 } : f)));

  const savePkg = () => {
    if (!draft.label || !draft.base) return;
    setPackages((ps) => [...ps, {
      id: "p" + Date.now(),
      label: draft.label, event: draft.event, includes: draft.includes,
      base: Number(draft.base) || 0,
      scaleOn: draft.scaleOn,
      included: Number(draft.included) || 0,
      extra: Number(draft.extra) || 0,
    }]);
    setDraft({ label: "", event: "Ogni evento", includes: "", base: "", scaleOn: "fisso", included: "", extra: "" });
    setBuilding(false);
  };

  const addExtra = () => {
    if (!newExtra.label || !newExtra.price) return;
    setExtras((es) => [...es, { id: "e" + Date.now(), label: newExtra.label, price: Number(newExtra.price) || 0 }]);
    setNewExtra({ label: "", price: "" });
  };
  const delExtra = (id) => setExtras((es) => es.filter((e) => e.id !== id));

  const so = scaleOpt(draft.scaleOn);

  return (
    <div>
      {packages.map((p) => {
        const s = scaleOpt(p.scaleOn);
        return (
          <div key={p.id} className="fp-pkg fp-card">
            <span className="fp-pkg-event">{p.event}</span>
            <div className="fp-pkg-head">
              <b>{p.label}</b>
              <button className="fp-btn" style={{ padding: "5px 10px" }} onClick={() => delPkg(p.id)} aria-label="Elimina pacchetto">
                <X size={13} />
              </button>
            </div>
            <small>{p.includes}</small>
            <div className="fp-price-edit">
              <Euro size={14} /> Prezzo base
              <input type="number" value={p.base} onChange={(e) => upPkg(p.id, "base", e.target.value)} />
              {p.scaleOn !== "fisso" && s && (
                <>
                  <Users size={14} /> {s.inclLabel}
                  <input type="number" value={p.included} onChange={(e) => upPkg(p.id, "included", e.target.value)} />
                  <span style={{ color: "var(--grigio)" }}>{s.extraLabel}</span>
                  <input type="number" value={p.extra} onChange={(e) => upPkg(p.id, "extra", e.target.value)} />
                </>
              )}
              {p.scaleOn === "fisso" && <span style={{ color: "var(--grigio)" }}>prezzo fisso</span>}
            </div>
          </div>
        );
      })}

      {!building ? (
        <button className="fp-btn ok" style={{ marginBottom: 12 }} onClick={() => setBuilding(true)}>
          <Plus size={15} /> Crea nuovo pacchetto
        </button>
      ) : (
        <div className="fp-pkg fp-card fp-form">
          <div className="fp-pkg-head"><b>Nuovo pacchetto</b></div>
          <label htmlFor="np-nome">Nome del pacchetto</label>
          <input id="np-nome" value={draft.label} placeholder='Es. "Banchetto personale", "Open bar tropicale"…'
                 onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          <label htmlFor="np-event">Per quale tipo di evento</label>
          <select id="np-event" value={draft.event} onChange={(e) => setDraft({ ...draft, event: e.target.value })}>
            {EVENT_OPTS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <label htmlFor="np-inc">Cosa include</label>
          <input id="np-inc" value={draft.includes} placeholder="Es. Banco bar personale · 4 ore · 3 signature drink"
                 onChange={(e) => setDraft({ ...draft, includes: e.target.value })} />
          <label htmlFor="np-base">Prezzo base (€)</label>
          <input id="np-base" type="number" value={draft.base}
                 onChange={(e) => setDraft({ ...draft, base: e.target.value })} />
          <label htmlFor="np-scale">Come scala il prezzo?</label>
          <select id="np-scale" value={draft.scaleOn} onChange={(e) => setDraft({ ...draft, scaleOn: e.target.value })}>
            {SCALE_OPTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          {draft.scaleOn !== "fisso" && so && (
            <>
              <label htmlFor="np-incl">{so.inclLabel}</label>
              <input id="np-incl" type="number" value={draft.included}
                     onChange={(e) => setDraft({ ...draft, included: e.target.value })} />
              <label htmlFor="np-extra">{so.extraLabel}</label>
              <input id="np-extra" type="number" value={draft.extra}
                     onChange={(e) => setDraft({ ...draft, extra: e.target.value })} />
            </>
          )}
          <div className="fp-req-actions" style={{ marginTop: 12 }}>
            <button className="fp-btn ok" onClick={savePkg}><Check size={15} /> Salva pacchetto</button>
            <button className="fp-btn" onClick={() => setBuilding(false)}>Annulla</button>
          </div>
        </div>
      )}

      <div className="fp-pkg fp-card">
        <div className="fp-pkg-head"><b>I tuoi extra</b></div>
        <small>Voci aggiuntive che il cliente può selezionare su qualsiasi pacchetto.</small>
        {extras.map((e) => (
          <div key={e.id} className="fp-price-edit" style={{ marginBottom: 8 }}>
            <Plus size={14} /> {e.label}
            <input type="number" value={e.price}
                   onChange={(ev) => setExtras((es) => es.map((x) => x.id === e.id ? { ...x, price: Number(ev.target.value) || 0 } : x))} />
            <span style={{ color: "var(--grigio)" }}>€</span>
            <button className="fp-btn" style={{ padding: "5px 10px" }} onClick={() => delExtra(e.id)} aria-label="Elimina extra">
              <X size={13} />
            </button>
          </div>
        ))}
        <div className="fp-price-edit" style={{ marginTop: 6 }}>
          <input style={{ width: 220 }} value={newExtra.label} placeholder="Nuovo extra (es. Gin corner)"
                 onChange={(e) => setNewExtra({ ...newExtra, label: e.target.value })} />
          <input type="number" value={newExtra.price} placeholder="€"
                 onChange={(e) => setNewExtra({ ...newExtra, price: e.target.value })} />
          <button className="fp-btn" onClick={addExtra}><Plus size={13} /> Aggiungi</button>
        </div>
      </div>

      <div className="fp-pkg fp-card">
        <span className="fp-pkg-event">Distanza</span>
        <div className="fp-pkg-head"><b>Le tue fasce chilometriche</b></div>
        <small>Il prezzo mostrato al cliente si adatta da solo alla zona del suo evento: lui vede solo il totale, mai i km.</small>
        {fasce.map((f) => (
          <div key={f.id} className="fp-price-edit" style={{ marginBottom: 8 }}>
            <Navigation size={14} /> {f.label}
            <input type="number" value={f.fee} onChange={(e) => upFascia(f.id, e.target.value)} />
            <span style={{ color: "var(--grigio)" }}>€ aggiunti al pacchetto</span>
          </div>
        ))}
      </div>

      <p className="fp-note">
        Ogni modifica al listino vale per le nuove richieste. Il team Click Eventi può aiutarti a impostare i prezzi giusti per la tua zona.
      </p>
    </div>
  );
}

function Profilo() {
  return (
    <div className="fp-form">
      <div className="fp-pkg fp-card">
        <div className="fp-pkg-head"><b>La tua presentazione</b></div>
        <label htmlFor="fp-bio">Bio (visibile ai clienti)</label>
        <textarea id="fp-bio" rows={3} defaultValue={"Violinista diplomata al conservatorio. Repertorio classico, pop e colonne sonore, in solo o con quartetto: la colonna sonora elegante del vostro evento."} />
        <label>Foto & video</label>
        <div className="fp-photos">
          <div className="fp-photo approved"><Camera size={18} /> Approvata</div>
          <div className="fp-photo approved"><Camera size={18} /> Approvata</div>
          <div className="fp-photo pending"><Clock size={18} /> In approvazione</div>
          <div className="fp-photo"><Plus size={18} /> Carica</div>
        </div>
        <p className="fp-note">
          Ogni foto e video viene verificato dal team Click Eventi prima di andare online: è la garanzia di qualità della piattaforma, per te e per i clienti.
        </p>
      </div>
    </div>
  );
}

/* ---------- app ---------- */

export default function PannelloFornitore() {
  const [tab, setTab] = useState("richieste");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [busy, setBusy] = useState(INITIAL_BUSY);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [fasce, setFasce] = useState(INITIAL_FASCE);
  const [extras, setExtras] = useState(INITIAL_EXTRAS);
  const nuove = requests.filter((r) => r.stato === "nuova").length;

  return (
    <div className="fp-root">
      <GlobalStyle />
      <header className="fp-header">
        <div className="fp-container fp-header-in">
          <div className="fp-logo">Click<em>Eventi</em><small>PANNELLO FORNITORE</small></div>
          <div className="fp-me">
            <div className="fp-avatar">EQ</div>
            <span>Elisa Quaranta</span>
          </div>
        </div>
      </header>

      <div className="fp-container">
        <div className="fp-stats">
          <div className="fp-stat fp-card"><TrendingUp size={18} /><b>41</b><span>eventi prenotati</span></div>
          <div className="fp-stat fp-card"><Star size={18} /><b>4.9</b><span>27 recensioni</span></div>
          <div className="fp-stat fp-card"><Inbox size={18} /><b>{nuove}</b><span>richieste da gestire</span></div>
          <div className="fp-stat fp-card"><Euro size={18} /><b>1.190 €</b><span>richieste questo mese</span></div>
        </div>

        <div className="fp-tabs">
          <button className={"fp-tab" + (tab === "richieste" ? " on" : "")} onClick={() => setTab("richieste")}>
            <Inbox size={15} /> Richieste {nuove > 0 && <span className="fp-badge">{nuove}</span>}
          </button>
          <button className={"fp-tab" + (tab === "calendario" ? " on" : "")} onClick={() => setTab("calendario")}>
            <CalendarDays size={15} /> Calendario
          </button>
          <button className={"fp-tab" + (tab === "pacchetti" ? " on" : "")} onClick={() => setTab("pacchetti")}>
            <Package size={15} /> Pacchetti & prezzi
          </button>
          <button className={"fp-tab" + (tab === "profilo" ? " on" : "")} onClick={() => setTab("profilo")}>
            <User size={15} /> Profilo
          </button>
        </div>

        {tab === "richieste" && <Richieste requests={requests} setRequests={setRequests} />}
        {tab === "calendario" && <Calendario busy={busy} setBusy={setBusy} />}
        {tab === "pacchetti" && <Pacchetti packages={packages} setPackages={setPackages} fasce={fasce} setFasce={setFasce} extras={extras} setExtras={setExtras} />}
        {tab === "profilo" && <Profilo />}

        <p className="fp-note" style={{ textAlign: "center", padding: "24px 0 32px" }}>
          Prototipo dimostrativo del pannello fornitore · Click Eventi
        </p>
      </div>
    </div>
  );
}
