import { useState, useEffect } from "react";
import {
  Inbox, CalendarDays, Package, User, Check, X, Euro, Clock, Users,
  MapPin, Plus, Trash2, Loader2, LogOut, Navigation, ImagePlus,
  ChevronLeft, ChevronRight, Star, TrendingUp, AlertCircle, Video, Link as LinkIcon
} from "lucide-react";
import { supabase } from "./supabase";
import { ComuneInput } from "./comuni.jsx";

/* ============================================================
   CLICK EVENTI — Pannello del professionista (collegato al DB)
   Ogni fornitore vede e gestisce SOLO le proprie cose:
   richieste, calendario, pacchetti/prezzi, profilo e foto.
   ============================================================ */

const EVENT_OPTS = ["Ogni evento", "Compleanno", "18esimo", "Festa privata", "Laurea", "Evento aziendale", "Evento pubblico", "Matrimonio"];
const SCALE_OPTS = [
  { id: "fisso", label: "Prezzo fisso" },
  { id: "ore", label: "A ore", inclLabel: "Ore incluse", extraLabel: "€ / ora in più" },
  { id: "ospiti", label: "A numero di ospiti", inclLabel: "Ospiti inclusi", extraLabel: "€ / ospite in più" },
  { id: "persone", label: "A persona", inclLabel: "Persone incluse", extraLabel: "€ / persona in più" },
];
const scaleOpt = (id) => SCALE_OPTS.find((s) => s.id === id) || SCALE_OPTS[0];
const MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const GIORNI = ["L","M","M","G","V","S","D"];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const dataIt = (s) => s ? new Date(s).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "data da definire";

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg:#fff;--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2;--ok:#1E9E6A;--ok-soft:#E7F6EF;--warn:#C77E1F;--warn-soft:#FBF2E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .fp-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .fp-display{font-family:'Sora',sans-serif}
    .fp-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center;position:sticky;top:0;z-index:20}
    .fp-wrap{max-width:900px;margin:0 auto;padding:0 20px;width:100%}
    .fp-headin{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .fp-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:19px;text-decoration:none;color:inherit}
    .fp-logo em{font-style:normal;color:var(--accent)}
    .fp-me{display:flex;align-items:center;gap:10px;font-weight:600;font-size:14px}
    .fp-av{width:34px;height:34px;border-radius:10px;background:var(--accent-soft);color:var(--accent);font:700 13px 'Sora';display:flex;align-items:center;justify-content:center;overflow:hidden}
    .fp-av img{width:100%;height:100%;object-fit:cover}
    .fp-link{background:none;border:none;color:var(--grigio);font:600 13px 'Work Sans';cursor:pointer;display:inline-flex;align-items:center;gap:6px;text-decoration:none}
    .fp-link:hover{color:var(--ink)}

    .fp-banner{background:var(--warn-soft);color:var(--warn);border-radius:12px;padding:13px 16px;font-size:13.5px;margin:18px 0 0;display:flex;gap:10px;align-items:flex-start}
    .fp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
    .fp-stat{background:#fff;border:1px solid var(--linea);border-radius:14px;padding:15px 17px}
    .fp-stat b{font-family:'Sora',sans-serif;font-size:22px;display:block}
    .fp-stat span{font-size:12.5px;color:var(--grigio);font-weight:600}
    .fp-stat svg{color:var(--accent);margin-bottom:7px}

    .fp-tabs{display:flex;gap:7px;margin-bottom:18px;flex-wrap:wrap}
    .fp-tab{font:600 13.5px 'Work Sans';color:var(--grigio);background:#fff;border:1px solid var(--linea);border-radius:999px;padding:9px 16px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
    .fp-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    .fp-badge{background:var(--accent);color:#fff;border-radius:999px;font-size:11px;font-weight:700;padding:1px 7px}

    .fp-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:20px;margin-bottom:13px}
    .fp-rhead{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}
    .fp-rhead h4{font-family:'Sora',sans-serif;font-size:16.5px}
    .fp-rtot{font-family:'Sora',sans-serif;font-size:20px;font-weight:700}
    .fp-rmeta{display:flex;flex-wrap:wrap;gap:13px;font-size:13px;color:var(--grigio);margin:9px 0 11px}
    .fp-rmeta span{display:inline-flex;align-items:center;gap:6px}
    .fp-nota{font-size:13.5px;background:var(--bg2);border-radius:10px;padding:10px 12px;margin-bottom:12px;line-height:1.5}
    .fp-acts{display:flex;gap:8px;flex-wrap:wrap}
    .fp-btn{display:inline-flex;align-items:center;gap:7px;font:600 13.5px 'Work Sans';border-radius:10px;padding:10px 16px;cursor:pointer;border:1px solid var(--linea);background:#fff;color:var(--ink)}
    .fp-btn.ok{background:var(--accent);border-color:var(--accent);color:#fff}
    .fp-btn.ok:hover{background:#7A5CE8}
    .fp-btn:disabled{opacity:.5;cursor:default}
    .fp-pill{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:4px 11px}
    .fp-pill.accettata{background:var(--ok-soft);color:var(--ok)}
    .fp-pill.rifiutata{background:#F6E7E7;color:#B44848}
    .fp-pill.controproposta{background:var(--warn-soft);color:var(--warn)}

    .fp-calnav{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
    .fp-calnav b{font-family:'Sora',sans-serif;font-size:17px}
    .fp-calnav button{background:#fff;border:1px solid var(--linea);border-radius:9px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink)}
    .fp-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
    .fp-dow{font-size:11.5px;font-weight:700;color:var(--grigio);text-align:center;padding-bottom:4px}
    .fp-day{aspect-ratio:1;border:1px solid var(--linea);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13.5px;cursor:pointer;background:#fff}
    .fp-day:hover{border-color:var(--ink)}
    .fp-day.busy{background:var(--ink);color:#fff;border-color:var(--ink)}
    .fp-day.empty{border:none;cursor:default;background:transparent}
    .fp-legend{display:flex;gap:16px;font-size:12.5px;color:var(--grigio);margin-top:12px}
    .fp-legend i{display:inline-block;width:12px;height:12px;border-radius:4px;margin-right:6px;vertical-align:-1px}

    label{display:block;font-size:13px;font-weight:600;margin:13px 0 5px}
    input,select,textarea{width:100%;border:1px solid var(--linea);border-radius:10px;font:500 14px 'Work Sans';padding:10px 12px;background:#fff;color:var(--ink);outline-color:var(--accent)}
    .fp-row{display:grid;grid-template-columns:1fr 1fr;gap:11px}
    .fp-inline{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:13.5px}
    .fp-inline input{width:96px}
    .fp-pkg{border:1px solid var(--linea);border-radius:12px;padding:15px;margin-bottom:11px;position:relative}
    .fp-del{background:none;border:none;color:var(--grigio);cursor:pointer;padding:4px}
    .fp-del:hover{color:#B44848}
    .fp-pkgtop{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
    .fp-evt{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--accent)}
    .fp-gal{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:8px}
    .fp-foto{position:relative;aspect-ratio:1;border-radius:11px;overflow:hidden;border:1px solid var(--linea);background:var(--bg2)}
    .fp-foto img{width:100%;height:100%;object-fit:cover;display:block}
    .fp-foto button{position:absolute;top:5px;right:5px;background:rgba(35,32,58,.75);border:none;color:#fff;border-radius:7px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .fp-add{aspect-ratio:1;border:1.5px dashed var(--accent);border-radius:11px;background:var(--accent-soft);color:var(--accent);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;font:600 11.5px 'Work Sans';text-align:center;padding:6px}
    .fp-cover{position:absolute;bottom:5px;left:5px;background:var(--accent);color:#fff;font:700 10px 'Work Sans';padding:2px 7px;border-radius:999px}
    .fp-hint{font-size:12px;color:var(--grigio);margin-top:7px}
    .fp-empty{background:#fff;border:1px dashed var(--linea);border-radius:16px;padding:40px 22px;text-align:center;color:var(--grigio)}
    .fp-center{text-align:center;padding:70px 20px;color:var(--grigio)}
    .fp-spin{animation:fp-rot 1s linear infinite}@keyframes fp-rot{to{transform:rotate(360deg)}}
    .fp-toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:50}
    .fp-save{position:sticky;bottom:14px;background:#fff;border:1px solid var(--linea);border-radius:14px;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;box-shadow:0 6px 20px rgba(35,32,58,.08);margin-top:6px}
    @media(max-width:700px){.fp-stats{grid-template-columns:1fr 1fr}.fp-row{grid-template-columns:1fr}.fp-gal{grid-template-columns:repeat(3,1fr)}}
  `}</style>
);

/* ---------------- RICHIESTE ---------------- */
function Richieste({ richieste, onAggiorna, busy }) {
  const [contro, setContro] = useState(null);
  const [dati, setDati] = useState({ prezzo: "", msg: "" });

  const apriContro = (r) => { setContro(r.id); setDati({ prezzo: r.totale || "", msg: "" }); };
  const inviaContro = (r) => {
    onAggiorna(r, { stato: "controproposta", contro_prezzo: Number(dati.prezzo) || r.totale, contro_msg: dati.msg || null }, "Controproposta inviata");
    setContro(null);
  };

  if (!richieste.length) {
    return <div className="fp-empty">Non hai ancora ricevuto richieste.<br />Quando un cliente ti sceglie, le trovi qui.</div>;
  }

  return (
    <div>
      {richieste.map((r) => (
        <div key={r.id} className="fp-card">
          <div className="fp-rhead">
            <h4 className="fp-display">{r.tipo_evento || "Evento"} · {r.cliente_nome}</h4>
            <span className="fp-rtot">{r.totale} €</span>
          </div>
          <div className="fp-rmeta">
            <span><CalendarDays size={13} /> {dataIt(r.data_evento)}</span>
            {r.localita && <span><MapPin size={13} /> {r.localita}</span>}
            {r.pacchetto && <span><Package size={13} /> {r.pacchetto}</span>}
            {r.ore ? <span><Clock size={13} /> {r.ore} h</span> : null}
            {r.ospiti ? <span><Users size={13} /> {r.ospiti} ospiti</span> : null}
          </div>
          {r.extra_scelti?.length > 0 && (
            <div className="fp-rmeta" style={{ marginTop: -4 }}>
              <span><Plus size={13} /> {r.extra_scelti.join(", ")}</span>
            </div>
          )}
          {r.note && <div className="fp-nota">"{r.note}"</div>}

          {r.stato === "nuova" && contro !== r.id && (
            <div className="fp-acts">
              <button className="fp-btn ok" disabled={busy} onClick={() => onAggiorna(r, { stato: "accettata" }, "Richiesta accettata")}>
                <Check size={15} /> Accetta
              </button>
              <button className="fp-btn" disabled={busy} onClick={() => apriContro(r)}>
                <Euro size={15} /> Proponi modifica
              </button>
              <button className="fp-btn" disabled={busy} onClick={() => onAggiorna(r, { stato: "rifiutata" }, "Richiesta rifiutata")}>
                <X size={15} /> Non disponibile
              </button>
            </div>
          )}

          {r.stato === "nuova" && contro === r.id && (
            <div style={{ borderTop: "1px dashed var(--linea)", paddingTop: 6 }}>
              <label>La tua controproposta (€)</label>
              <input type="number" value={dati.prezzo} onChange={(e) => setDati({ ...dati, prezzo: e.target.value })} />
              <label>Messaggio per il cliente</label>
              <textarea rows={2} value={dati.msg} onChange={(e) => setDati({ ...dati, msg: e.target.value })}
                        placeholder="Es. per quella data posso solo dalle 19: propongo 2 ore invece di 3…" />
              <div className="fp-acts" style={{ marginTop: 11 }}>
                <button className="fp-btn ok" disabled={busy} onClick={() => inviaContro(r)}><Check size={15} /> Invia</button>
                <button className="fp-btn" onClick={() => setContro(null)}>Annulla</button>
              </div>
            </div>
          )}

          {r.stato === "accettata" && <span className="fp-pill accettata">✓ Accettata — il team avvisa il cliente</span>}
          {r.stato === "rifiutata" && <span className="fp-pill rifiutata">Rifiutata</span>}
          {r.stato === "controproposta" && (
            <div>
              <span className="fp-pill controproposta">↔ Controproposta inviata: {r.contro_prezzo} €</span>
              {r.contro_msg && <div className="fp-nota" style={{ marginTop: 9 }}>Tuo messaggio: "{r.contro_msg}"</div>}
            </div>
          )}
        </div>
      ))}
      <p className="fp-hint" style={{ textAlign: "center", padding: "6px 0 20px" }}>
        Le richieste arrivano dal team Click Eventi con il preventivo già calcolato sul tuo listino.
      </p>
    </div>
  );
}

/* ---------------- CALENDARIO ---------------- */
function Calendario({ occupati, onToggle }) {
  const oggi = new Date();
  const [anno, setAnno] = useState(oggi.getFullYear());
  const [mese, setMese] = useState(oggi.getMonth());

  const primo = new Date(anno, mese, 1).getDay();       // 0=dom
  const offset = (primo + 6) % 7;                        // lunedì primo
  const giorni = new Date(anno, mese + 1, 0).getDate();
  const celle = [...Array(offset).fill(null), ...Array.from({ length: giorni }, (_, i) => i + 1)];

  const cambia = (d) => {
    let m = mese + d, a = anno;
    if (m < 0) { m = 11; a--; } if (m > 11) { m = 0; a++; }
    setMese(m); setAnno(a);
  };

  return (
    <div className="fp-card">
      <div className="fp-calnav">
        <button onClick={() => cambia(-1)} aria-label="Mese precedente"><ChevronLeft size={17} /></button>
        <b className="fp-display">{MESI[mese]} {anno}</b>
        <button onClick={() => cambia(1)} aria-label="Mese successivo"><ChevronRight size={17} /></button>
      </div>
      <div className="fp-grid">
        {GIORNI.map((g, i) => <div key={i} className="fp-dow">{g}</div>)}
        {celle.map((d, i) => d === null
          ? <div key={"e" + i} className="fp-day empty" />
          : (() => {
              const key = iso(anno, mese, d);
              const busy = occupati.includes(key);
              return (
                <div key={key} className={"fp-day" + (busy ? " busy" : "")} role="button" tabIndex={0}
                     onClick={() => onToggle(key, busy)} onKeyDown={(e) => e.key === "Enter" && onToggle(key, busy)}>
                  {d}
                </div>
              );
            })()
        )}
      </div>
      <div className="fp-legend">
        <span><i style={{ background: "#fff", border: "1px solid var(--linea)" }} /> Libero</span>
        <span><i style={{ background: "var(--ink)" }} /> Occupato (tocca per cambiare)</span>
      </div>
      <div className="fp-banner" style={{ marginTop: 14 }}>
        <AlertCircle size={16} />
        <span>I giorni segnati come occupati non compaiono nelle ricerche dei clienti. In arrivo: sincronizzazione con Google Calendar.</span>
      </div>
    </div>
  );
}

/* ---------------- PACCHETTI & PREZZI ---------------- */
function Listino({ f, ricarica, mostra }) {
  const [pkg, setPkg] = useState(f.pacchetti || []);
  const [extra, setExtra] = useState(f.extra || []);
  const [fasce, setFasce] = useState([...(f.fasce || [])].sort((a, b) => a.fino_a_km - b.fino_a_km));
  const [nuovo, setNuovo] = useState(null);
  const [nuovoExtra, setNuovoExtra] = useState({ label: "", prezzo: "" });
  const [salvando, setSalvando] = useState(false);

  const upPkg = (id, k, v) => setPkg(pkg.map((p) => p.id === id ? { ...p, [k]: v } : p));
  const upExtra = (id, k, v) => setExtra(extra.map((e) => e.id === id ? { ...e, [k]: v } : e));
  const upFascia = (id, v) => setFasce(fasce.map((x) => x.id === id ? { ...x, fee: v } : x));

  const salva = async () => {
    setSalvando(true);
    for (const p of pkg) {
      await supabase.from("pacchetti").update({
        label: p.label, evento: p.evento, base: Number(p.base) || 0, includes: p.includes,
        scale_on: p.scale_on, inclusi: Number(p.inclusi) || 0, extra_unita: Number(p.extra_unita) || 0,
      }).eq("id", p.id);
    }
    for (const e of extra) await supabase.from("extra").update({ label: e.label, prezzo: Number(e.prezzo) || 0 }).eq("id", e.id);
    for (const x of fasce) await supabase.from("fasce").update({ fee: Number(x.fee) || 0 }).eq("id", x.id);
    setSalvando(false);
    mostra("Listino aggiornato ✓");
    ricarica();
  };

  const creaPkg = async () => {
    if (!nuovo?.label || !nuovo?.base) { mostra("Servono nome e prezzo"); return; }
    const { error } = await supabase.from("pacchetti").insert({
      fornitore_id: f.id, label: nuovo.label, evento: nuovo.evento, base: Number(nuovo.base) || 0,
      includes: nuovo.includes, scale_on: nuovo.scale_on, inclusi: Number(nuovo.inclusi) || 0,
      extra_unita: Number(nuovo.extra_unita) || 0,
    });
    if (error) { mostra("Errore: " + error.message); return; }
    setNuovo(null); mostra("Pacchetto aggiunto ✓"); ricarica();
  };
  const eliminaPkg = async (id) => { await supabase.from("pacchetti").delete().eq("id", id); mostra("Pacchetto eliminato"); ricarica(); };
  const creaExtra = async () => {
    if (!nuovoExtra.label || !nuovoExtra.prezzo) return;
    await supabase.from("extra").insert({ fornitore_id: f.id, label: nuovoExtra.label, prezzo: Number(nuovoExtra.prezzo) || 0 });
    setNuovoExtra({ label: "", prezzo: "" }); mostra("Extra aggiunto ✓"); ricarica();
  };
  const eliminaExtra = async (id) => { await supabase.from("extra").delete().eq("id", id); ricarica(); };

  return (
    <div>
      {pkg.map((p) => {
        const s = scaleOpt(p.scale_on);
        return (
          <div key={p.id} className="fp-pkg">
            <div className="fp-pkgtop">
              <span className="fp-evt">{p.evento === "Tutti" ? "Ogni evento" : p.evento}</span>
              <button className="fp-del" onClick={() => eliminaPkg(p.id)} aria-label="Elimina"><Trash2 size={15} /></button>
            </div>
            <label>Nome</label>
            <input value={p.label} onChange={(e) => upPkg(p.id, "label", e.target.value)} />
            <div className="fp-row">
              <div><label>Per quale evento</label>
                <select value={p.evento} onChange={(e) => upPkg(p.id, "evento", e.target.value)}>
                  {["Tutti", ...EVENT_OPTS.filter((x) => x !== "Ogni evento")].map((t) => <option key={t} value={t}>{t === "Tutti" ? "Ogni evento" : t}</option>)}
                </select></div>
              <div><label>Prezzo base (€)</label>
                <input type="number" value={p.base} onChange={(e) => upPkg(p.id, "base", e.target.value)} /></div>
            </div>
            <label>Cosa include</label>
            <input value={p.includes || ""} onChange={(e) => upPkg(p.id, "includes", e.target.value)} placeholder="Es. 1 ora · Impianto incluso" />
            <label>Come scala il prezzo</label>
            <select value={p.scale_on} onChange={(e) => upPkg(p.id, "scale_on", e.target.value)}>
              {SCALE_OPTS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
            {p.scale_on !== "fisso" && (
              <div className="fp-row">
                <div><label>{s.inclLabel}</label><input type="number" value={p.inclusi} onChange={(e) => upPkg(p.id, "inclusi", e.target.value)} /></div>
                <div><label>{s.extraLabel}</label><input type="number" value={p.extra_unita} onChange={(e) => upPkg(p.id, "extra_unita", e.target.value)} /></div>
              </div>
            )}
          </div>
        );
      })}

      {nuovo ? (
        <div className="fp-pkg">
          <div className="fp-evt">Nuovo pacchetto</div>
          <label>Nome</label>
          <input value={nuovo.label} onChange={(e) => setNuovo({ ...nuovo, label: e.target.value })} placeholder='Es. "Set acustico"' />
          <div className="fp-row">
            <div><label>Per quale evento</label>
              <select value={nuovo.evento} onChange={(e) => setNuovo({ ...nuovo, evento: e.target.value })}>
                {["Tutti", ...EVENT_OPTS.filter((x) => x !== "Ogni evento")].map((t) => <option key={t} value={t}>{t === "Tutti" ? "Ogni evento" : t}</option>)}
              </select></div>
            <div><label>Prezzo base (€)</label><input type="number" value={nuovo.base} onChange={(e) => setNuovo({ ...nuovo, base: e.target.value })} /></div>
          </div>
          <label>Cosa include</label>
          <input value={nuovo.includes} onChange={(e) => setNuovo({ ...nuovo, includes: e.target.value })} />
          <label>Come scala il prezzo</label>
          <select value={nuovo.scale_on} onChange={(e) => setNuovo({ ...nuovo, scale_on: e.target.value })}>
            {SCALE_OPTS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          {nuovo.scale_on !== "fisso" && (
            <div className="fp-row">
              <div><label>{scaleOpt(nuovo.scale_on).inclLabel}</label><input type="number" value={nuovo.inclusi} onChange={(e) => setNuovo({ ...nuovo, inclusi: e.target.value })} /></div>
              <div><label>{scaleOpt(nuovo.scale_on).extraLabel}</label><input type="number" value={nuovo.extra_unita} onChange={(e) => setNuovo({ ...nuovo, extra_unita: e.target.value })} /></div>
            </div>
          )}
          <div className="fp-acts" style={{ marginTop: 12 }}>
            <button className="fp-btn ok" onClick={creaPkg}><Check size={15} /> Salva pacchetto</button>
            <button className="fp-btn" onClick={() => setNuovo(null)}>Annulla</button>
          </div>
        </div>
      ) : (
        <button className="fp-btn" style={{ marginBottom: 14 }} onClick={() => setNuovo({ label: "", evento: "Tutti", base: "", includes: "", scale_on: "fisso", inclusi: "", extra_unita: "" })}>
          <Plus size={15} /> Crea nuovo pacchetto
        </button>
      )}

      <div className="fp-card">
        <b className="fp-display" style={{ fontSize: 16 }}>I tuoi extra</b>
        <p className="fp-hint">Voci che il cliente può aggiungere a qualsiasi pacchetto.</p>
        {extra.map((e) => (
          <div key={e.id} className="fp-inline" style={{ marginTop: 9 }}>
            <input style={{ flex: 1, width: "auto" }} value={e.label} onChange={(ev) => upExtra(e.id, "label", ev.target.value)} />
            <input type="number" value={e.prezzo} onChange={(ev) => upExtra(e.id, "prezzo", ev.target.value)} />
            <span>€</span>
            <button className="fp-del" onClick={() => eliminaExtra(e.id)}><Trash2 size={15} /></button>
          </div>
        ))}
        <div className="fp-inline" style={{ marginTop: 11 }}>
          <input style={{ flex: 1, width: "auto" }} value={nuovoExtra.label} onChange={(e) => setNuovoExtra({ ...nuovoExtra, label: e.target.value })} placeholder="Nuovo extra" />
          <input type="number" value={nuovoExtra.prezzo} onChange={(e) => setNuovoExtra({ ...nuovoExtra, prezzo: e.target.value })} placeholder="€" />
          <button className="fp-btn" onClick={creaExtra}><Plus size={14} /> Aggiungi</button>
        </div>
      </div>

      <div className="fp-card">
        <b className="fp-display" style={{ fontSize: 16 }}>Le tue tariffe di zona</b>
        <p className="fp-hint">Il prezzo mostrato al cliente si adatta da solo alla zona: lui vede solo il totale, mai i km.</p>
        {fasce.map((x) => (
          <div key={x.id} className="fp-inline" style={{ marginTop: 10 }}>
            <Navigation size={14} />
            <span style={{ minWidth: 110 }}>{x.fino_a_km >= 9999 ? "Oltre" : `Entro ${x.fino_a_km} km`}</span>
            <input type="number" value={x.fee} onChange={(e) => upFascia(x.id, e.target.value)} />
            <span style={{ color: "var(--grigio)" }}>€ aggiunti</span>
          </div>
        ))}
      </div>

      <div className="fp-save">
        <span style={{ fontSize: 13.5, color: "var(--grigio)" }}>Le modifiche valgono per le nuove richieste.</span>
        <button className="fp-btn ok" onClick={salva} disabled={salvando}>
          {salvando ? <><Loader2 size={15} className="fp-spin" /> Salvo…</> : <><Check size={15} /> Salva modifiche</>}
        </button>
      </div>
    </div>
  );
}

/* ---------------- PROFILO ---------------- */
function Profilo({ f, user, ricarica, mostra }) {
  const [d, setD] = useState({
    nome: f.nome || "", ruolo: f.ruolo || "",
    telefono: f.telefono || "", bio: f.bio || "", link: f.link || "", video_link: f.video_link || "",
  });
  const [comune, setComune] = useState(
    f.localita ? { name: f.localita, area: f.provincia, lat: f.lat, lng: f.lng } : null
  );
  const [foto, setFoto] = useState((f.foto || []).map((u) => ({ url: u, path: null })));
  const [caricando, setCaricando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carica = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setCaricando(true);
    const nuove = [];
    for (const file of files) {
      if (foto.length + nuove.length >= 6) break;
      if (file.size > 5 * 1024 * 1024) { mostra("Immagine troppo pesante (max 5 MB)"); continue; }
      const est = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${est}`;
      const { error } = await supabase.storage.from("foto").upload(path, file);
      if (error) { mostra("Errore caricamento: " + error.message); continue; }
      const { data } = supabase.storage.from("foto").getPublicUrl(path);
      nuove.push({ url: data.publicUrl, path });
    }
    setFoto([...foto, ...nuove]);
    setCaricando(false);
    e.target.value = "";
  };
  const rimuovi = (i) => setFoto(foto.filter((_, x) => x !== i));

  const salva = async () => {
    setSalvando(true);
    if (!comune) { setSalvando(false); mostra("Scegli il comune dall'elenco dei suggerimenti"); return; }
    const { error } = await supabase.from("fornitori").update({
      nome: d.nome, ruolo: d.ruolo,
      localita: comune.name, provincia: comune.area, lat: comune.lat, lng: comune.lng,
      telefono: d.telefono,
      bio: d.bio || null, link: d.link || null, video_link: d.video_link || null,
      foto: foto.map((x) => x.url),
    }).eq("id", f.id);
    setSalvando(false);
    if (error) { mostra("Errore: " + error.message); return; }
    mostra("Profilo aggiornato ✓");
    ricarica();
  };

  return (
    <div>
      <div className="fp-card">
        <b className="fp-display" style={{ fontSize: 16 }}>Le tue foto</b>
        <p className="fp-hint">La prima è la copertina che vedono i clienti nei risultati.</p>
        <div className="fp-gal">
          {foto.map((x, i) => (
            <div key={i} className="fp-foto">
              <img src={x.url} alt={`Foto ${i + 1}`} />
              <button onClick={() => rimuovi(i)} aria-label="Rimuovi"><X size={13} /></button>
              {i === 0 && <span className="fp-cover">Copertina</span>}
            </div>
          ))}
          {foto.length < 6 && (
            <label className="fp-add">
              {caricando ? <Loader2 size={20} className="fp-spin" /> : <ImagePlus size={20} />}
              {caricando ? "Carico…" : "Aggiungi"}
              <input type="file" accept="image/*" multiple onChange={carica} style={{ display: "none" }} disabled={caricando} />
            </label>
          )}
        </div>
      </div>

      <div className="fp-card">
        <b className="fp-display" style={{ fontSize: 16 }}>I tuoi dati</b>
        <div className="fp-row">
          <div><label>Nome o nome d'arte</label><input value={d.nome} onChange={(e) => setD({ ...d, nome: e.target.value })} /></div>
          <div><label>Cosa fai</label><input value={d.ruolo} onChange={(e) => setD({ ...d, ruolo: e.target.value })} /></div>
        </div>
        <div className="fp-row">
          <div><label htmlFor="fp-comune">Comune</label><ComuneInput id="fp-comune" valore={comune?.name} onChange={setComune} /></div>
          <div><label>Telefono</label><input value={d.telefono} onChange={(e) => setD({ ...d, telefono: e.target.value })} /></div>
        </div>
        <label>Presentazione (la leggono i clienti)</label>
        <textarea rows={4} value={d.bio} onChange={(e) => setD({ ...d, bio: e.target.value })}
                  placeholder="Racconta chi sei, il tuo stile, cosa rende speciale il tuo servizio…" />
        <label><LinkIcon size={13} style={{ verticalAlign: "-2px" }} /> Link (Instagram, sito…)</label>
        <input value={d.link} onChange={(e) => setD({ ...d, link: e.target.value })} placeholder="https://instagram.com/…" />
        <label><Video size={13} style={{ verticalAlign: "-2px" }} /> Link a un video</label>
        <input value={d.video_link} onChange={(e) => setD({ ...d, video_link: e.target.value })} placeholder="https://youtube.com/…" />
      </div>

      <div className="fp-save">
        <span style={{ fontSize: 13.5, color: "var(--grigio)" }}>Le modifiche sono subito visibili sul tuo profilo.</span>
        <button className="fp-btn ok" onClick={salva} disabled={salvando}>
          {salvando ? <><Loader2 size={15} className="fp-spin" /> Salvo…</> : <><Check size={15} /> Salva profilo</>}
        </button>
      </div>
    </div>
  );
}

/* ---------------- APP ---------------- */
export default function Pannello() {
  const [stato, setStato] = useState("check");
  const [user, setUser] = useState(null);
  const [f, setF] = useState(null);
  const [richieste, setRichieste] = useState([]);
  const [tab, setTab] = useState("richieste");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const mostra = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const carica = async (uid) => {
    const { data: forn } = await supabase
      .from("fornitori")
      .select("*, pacchetti(*), extra(*), fasce(*), indisponibilita(giorno)")
      .eq("user_id", uid).maybeSingle();
    setF(forn);
    if (forn?.id) {
      const { data: rich } = await supabase.from("richieste").select("*")
        .eq("fornitore_id", forn.id).order("created_at", { ascending: false });
      setRichieste(rich || []);
    }
  };

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setStato("nonloggato"); return; }
      setUser(session.user);
      await carica(session.user.id);
      setStato("ok");
    })();
  }, []);

  const ricarica = () => user && carica(user.id);

  const aggiornaRichiesta = async (r, campi, msg) => {
    setBusy(true);
    const { error } = await supabase.from("richieste").update(campi).eq("id", r.id);
    setBusy(false);
    if (error) { mostra("Errore: " + error.message); return; }
    mostra(msg); ricarica();
  };

  const toggleGiorno = async (giorno, occupato) => {
    if (occupato) await supabase.from("indisponibilita").delete().eq("fornitore_id", f.id).eq("giorno", giorno);
    else await supabase.from("indisponibilita").insert({ fornitore_id: f.id, giorno });
    ricarica();
  };

  if (stato === "check") return <div className="fp-root"><Style /><div className="fp-center"><Loader2 size={26} className="fp-spin" /><p style={{ marginTop: 10 }}>Carico il tuo pannello…</p></div></div>;
  if (stato === "nonloggato") return <div className="fp-root"><Style /><div className="fp-center">
    <p style={{ marginBottom: 14 }}>Accedi per gestire il tuo profilo.</p>
    <a href="/?accedi" className="fp-btn ok" style={{ textDecoration: "none" }}>Vai al login</a></div></div>;
  if (!f) return <div className="fp-root"><Style /><div className="fp-center">
    <p style={{ marginBottom: 14 }}>Non abbiamo trovato il tuo profilo.</p>
    <a href="/?iscrizione" className="fp-btn ok" style={{ textDecoration: "none" }}>Completa l'iscrizione</a></div></div>;

  /* profilo non ancora compilato: invitiamo a completarlo invece di mostrare
     un pannello vuoto (succede a chi si ferma dopo email e password) */
  const incompleto = !f.nome || f.nome === "Nuovo professionista" || !f.ruolo || !(f.pacchetti?.length);
  if (incompleto) {
    return (
      <div className="fp-root"><Style />
        <header className="fp-head">
          <div className="fp-wrap fp-headin">
            <a href="/" className="fp-logo">Click<em>Eventi</em></a>
            <button className="fp-link" onClick={async () => { await supabase.auth.signOut(); location.href = "/"; }}>
              <LogOut size={14} /> Esci
            </button>
          </div>
        </header>
        <div className="fp-wrap" style={{ maxWidth: 560 }}>
          <div className="fp-card" style={{ textAlign: "center", padding: "36px 26px", marginTop: 30 }}>
            <div style={{ width: 58, height: 58, borderRadius: 16, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <User size={26} />
            </div>
            <h2 className="fp-display" style={{ fontSize: 22, marginBottom: 8 }}>Completa il tuo profilo</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--grigio)", marginBottom: 22 }}>
              Il tuo account è attivo, ma il profilo non è ancora compilato.
              Aggiungi chi sei, i tuoi pacchetti e le foto: solo così il team può
              verificarlo e pubblicarlo sul sito.
            </p>
            <a href="/?iscrizione" className="fp-btn ok" style={{ textDecoration: "none" }}>
              Completa il profilo
            </a>
            <p style={{ marginTop: 16, fontSize: 13 }}>
              <a href="/?admin" style={{ color: "var(--grigio)" }}>Sei l'amministratore? Vai all'area admin</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const nuove = richieste.filter((r) => r.stato === "nuova").length;
  const valore = richieste.filter((r) => r.stato !== "rifiutata").reduce((s, r) => s + (r.totale || 0), 0);
  const occupati = (f.indisponibilita || []).map((x) => x.giorno);

  return (
    <div className="fp-root"><Style />
      <header className="fp-head">
        <div className="fp-wrap fp-headin">
          <a href="/" className="fp-logo">Click<em>Eventi</em></a>
          <div className="fp-me">
            <div className="fp-av">{f.foto?.length ? <img src={f.foto[0]} alt="" /> : (f.nome || "?").slice(0, 2).toUpperCase()}</div>
            <span>{f.nome}</span>
            <button className="fp-link" onClick={async () => { await supabase.auth.signOut(); location.href = "/"; }}>
              <LogOut size={14} /> Esci
            </button>
          </div>
        </div>
      </header>

      <div className="fp-wrap">
        {f.stato !== "approvato" && (
          <div className="fp-banner">
            <AlertCircle size={17} />
            <span><b>Profilo in attesa di approvazione.</b> Puoi già completare tutto: appena il team lo verifica, il tuo profilo va online e inizi a ricevere richieste.</span>
          </div>
        )}

        <div className="fp-stats">
          <div className="fp-stat"><TrendingUp size={17} /><b>{f.prenotazioni || 0}</b><span>eventi prenotati</span></div>
          <div className="fp-stat"><Star size={17} /><b>{f.rating || "—"}</b><span>{f.recensioni || 0} recensioni</span></div>
          <div className="fp-stat"><Inbox size={17} /><b>{nuove}</b><span>richieste da gestire</span></div>
          <div className="fp-stat"><Euro size={17} /><b>{valore} €</b><span>valore richieste</span></div>
        </div>

        <div className="fp-tabs">
          <button className={"fp-tab" + (tab === "richieste" ? " on" : "")} onClick={() => setTab("richieste")}>
            <Inbox size={15} /> Richieste {nuove > 0 && <span className="fp-badge">{nuove}</span>}
          </button>
          <button className={"fp-tab" + (tab === "calendario" ? " on" : "")} onClick={() => setTab("calendario")}>
            <CalendarDays size={15} /> Calendario
          </button>
          <button className={"fp-tab" + (tab === "listino" ? " on" : "")} onClick={() => setTab("listino")}>
            <Package size={15} /> Pacchetti & prezzi
          </button>
          <button className={"fp-tab" + (tab === "profilo" ? " on" : "")} onClick={() => setTab("profilo")}>
            <User size={15} /> Profilo
          </button>
        </div>

        {tab === "richieste" && <Richieste richieste={richieste} onAggiorna={aggiornaRichiesta} busy={busy} />}
        {tab === "calendario" && <Calendario occupati={occupati} onToggle={toggleGiorno} />}
        {tab === "listino" && <Listino key={f.id + "-" + (f.pacchetti?.length || 0)} f={f} ricarica={ricarica} mostra={mostra} />}
        {tab === "profilo" && <Profilo key={f.id} f={f} user={user} ricarica={ricarica} mostra={mostra} />}

        <div style={{ height: 30 }} />
      </div>

      {toast && <div className="fp-toast">{toast}</div>}
    </div>
  );
}
