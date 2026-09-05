import { useState, useEffect } from "react";
import {
  Check, X, MapPin, Phone, Mail, Navigation, Search,
  ShieldCheck, Loader2, LogOut, Inbox, Users, Lightbulb,
  Link as LinkIcon, ArrowLeft, ChevronRight, Calendar, Video, ImageOff, Pencil
} from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — Area amministratore
   Lista compatta degli iscritti → clic → scheda di dettaglio
   con tutti i dati e le azioni (approva / rifiuta / verificato).
   ============================================================ */

const CAT_LABEL = {
  musica: "Musica", foto: "Foto & Video", barman: "Beverage",
  animazione: "Animazione", beauty: "Hair & Beauty",
};

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2;--ok:#1E9E6A;--ok-soft:#E7F6EF;--warn:#C77E1F;--warn-soft:#FBF2E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .ad-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .ad-display{font-family:'Sora',sans-serif}
    .ad-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center;position:sticky;top:0;z-index:20}
    .ad-wrap{max-width:960px;margin:0 auto;padding:0 20px;width:100%}
    .ad-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .ad-logo em{font-style:normal;color:var(--accent)}
    .ad-headin{display:flex;align-items:center;justify-content:space-between}
    .ad-tag{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:3px 10px;margin-left:10px}
    .ad-link{background:none;border:none;color:var(--grigio);font:600 13px 'Work Sans';cursor:pointer;display:inline-flex;align-items:center;gap:6px;text-decoration:none}
    .ad-link:hover{color:var(--ink)}

    .ad-tabs{display:flex;gap:8px;margin:22px 0 14px;flex-wrap:wrap;align-items:center}
    .ad-tab{font:600 13.5px 'Work Sans';color:var(--grigio);background:#fff;border:1px solid var(--linea);border-radius:999px;padding:9px 16px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
    .ad-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    .ad-badge{background:var(--accent);color:#fff;border-radius:999px;font-size:11px;font-weight:700;padding:1px 7px}
    .ad-search{margin-left:auto;position:relative}
    .ad-search input{border:1px solid var(--linea);border-radius:999px;font:500 13.5px 'Work Sans';padding:9px 14px 9px 34px;background:#fff;color:var(--ink);outline-color:var(--accent);width:210px}
    .ad-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--grigio)}

    /* LISTA compatta */
    .ad-list{background:#fff;border:1px solid var(--linea);border-radius:14px;overflow:hidden}
    .ad-row{display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer;border-bottom:1px solid var(--linea);transition:background .12s}
    .ad-row:last-child{border-bottom:none}
    .ad-row:hover{background:var(--bg2)}
    .ad-av{width:40px;height:40px;border-radius:11px;background:var(--accent-soft);color:var(--accent);font:700 15px 'Sora';display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .ad-rowmain{flex:1;min-width:0}
    .ad-rowname{font-weight:700;font-size:15px;display:flex;align-items:center;gap:7px;flex-wrap:wrap}
    .ad-rowsub{color:var(--grigio);font-size:13px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .ad-cat{display:inline-block;background:var(--accent-soft);color:var(--accent);border-radius:999px;font-size:11.5px;font-weight:600;padding:2px 9px}
    .ad-flag{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px}
    .ad-flag.nolink{background:var(--warn-soft);color:var(--warn)}
    .ad-flag.ok{background:var(--ok-soft);color:var(--ok)}
    .ad-rowdate{color:var(--grigio);font-size:12.5px;white-space:nowrap}
    .ad-chev{color:var(--grigio);flex-shrink:0}

    /* DETTAGLIO */
    .ad-back{background:none;border:none;color:var(--grigio);font:600 14px 'Work Sans';cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:18px 0 10px}
    .ad-back:hover{color:var(--ink)}
    .ad-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:24px;margin-bottom:14px}
    .ad-dhead{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}
    .ad-av-big{width:64px;height:64px;border-radius:16px;font-size:22px}
    .ad-fname{font-family:'Sora',sans-serif;font-size:22px;font-weight:700}
    .ad-frole{color:var(--grigio);font-size:14.5px;margin-top:3px}
    .ad-meta{display:flex;flex-wrap:wrap;gap:14px;font-size:13.5px;color:var(--grigio);margin-top:12px}
    .ad-meta span{display:inline-flex;align-items:center;gap:6px}
    .ad-meta a{color:var(--accent);font-weight:600;text-decoration:none}
    .ad-propose{background:var(--warn-soft);color:var(--warn);border-radius:10px;padding:11px 13px;font-size:13px;margin-top:14px;display:flex;gap:9px;align-items:flex-start}
    .ad-sec{border-top:1px solid var(--linea);margin-top:18px;padding-top:16px}
    .ad-sec h5{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--grigio);margin-bottom:10px}
    .ad-pkg{border:1px solid var(--linea);border-radius:10px;padding:11px 13px;margin-bottom:8px}
    .ad-pkg b{font-size:14.5px}
    .ad-pkg small{color:var(--grigio);font-size:12.5px;display:block;margin-top:3px;line-height:1.5}
    .ad-chips{display:flex;flex-wrap:wrap;gap:6px}
    .ad-chip{background:var(--bg2);border:1px solid var(--linea);border-radius:999px;font-size:12.5px;padding:4px 10px}
    .ad-vuoto{color:var(--grigio);font-size:13.5px;font-style:italic}
    .ad-gal{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .ad-gal a{display:block;aspect-ratio:1;border-radius:10px;overflow:hidden;border:1px solid var(--linea)}
    .ad-gal img{width:100%;height:100%;object-fit:cover;display:block}
    @media(max-width:560px){.ad-gal{grid-template-columns:repeat(3,1fr)}}

    .ad-actions{position:sticky;bottom:0;background:#fff;border:1px solid var(--linea);border-radius:16px;padding:16px;display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-bottom:30px}
    .ad-btn{display:inline-flex;align-items:center;gap:7px;font:600 14px 'Work Sans';border-radius:10px;padding:11px 18px;cursor:pointer;border:1px solid var(--linea);background:#fff;color:var(--ink)}
    .ad-btn.ok{background:var(--ok);border-color:var(--ok);color:#fff}
    .ad-btn.no{background:#fff;border-color:#E0B0B0;color:#B44848}
    .ad-btn:hover{filter:brightness(.97)}
    .ad-btn:disabled{opacity:.5;cursor:default}
    .ad-verif{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:600;color:var(--grigio);cursor:pointer;margin-left:auto}
    .ad-verif input{accent-color:var(--accent);width:16px;height:16px}

    .ad-empty{background:#fff;border:1px dashed var(--linea);border-radius:16px;padding:44px 24px;text-align:center;color:var(--grigio)}
    .ad-center{text-align:center;padding:70px 20px;color:var(--grigio)}
    .ad-spin{animation:ad-rot 1s linear infinite}@keyframes ad-rot{to{transform:rotate(360deg)}}
    .ad-toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:50}
    @media(max-width:560px){.ad-search{margin-left:0;width:100%}.ad-search input{width:100%}.ad-rowdate{display:none}}
  `}</style>
);

const iniziali = (n) => (n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const dataIt = (s) => s ? new Date(s).toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "";
const categoriaProposta = (bio) =>
  bio && bio.startsWith("Categoria proposta dal fornitore:")
    ? bio.replace("Categoria proposta dal fornitore:", "").trim() : null;

/* ---------- riga della lista ---------- */
function Riga({ f, onApri }) {
  return (
    <div className="ad-row" onClick={() => onApri(f)} role="button" tabIndex={0}
         onKeyDown={(e) => e.key === "Enter" && onApri(f)}>
      <div className="ad-av">{iniziali(f.nome)}</div>
      <div className="ad-rowmain">
        <div className="ad-rowname">
          {f.nome}
          <span className="ad-cat">{CAT_LABEL[f.categoria] || f.categoria}</span>
          {f.stato === "in_attesa" && !f.link && <span className="ad-flag nolink">senza link</span>}
          {f.stato === "in_attesa" && !f.foto?.length && <span className="ad-flag nolink">senza foto</span>}
          {f.verificato && <span className="ad-flag ok">✓ Verificato</span>}
        </div>
        <div className="ad-rowsub">
          {f.ruolo}{f.localita ? ` · ${f.localita}` : ""}
          {f.pacchetti?.length ? ` · ${f.pacchetti.length} pacchett${f.pacchetti.length === 1 ? "o" : "i"}` : " · nessun pacchetto"}
        </div>
      </div>
      <span className="ad-rowdate">{dataIt(f.created_at)}</span>
      <ChevronRight size={18} className="ad-chev" />
    </div>
  );
}

/* ---------- scheda di dettaglio ---------- */
const MOTIVI = [
  "Le foto non permettono di capire il tuo lavoro",
  "Il profilo è incompleto: mancano informazioni",
  "La categoria indicata non corrisponde al servizio",
  "Non siamo riusciti a verificare la tua attività dal link",
  "I pacchetti non sono chiari o mancano i prezzi",
];

function Dettaglio({ f, onIndietro, onApprova, onRifiuta, onVerif, busy }) {
  const proposta = categoriaProposta(f.bio);
  const [rifiutando, setRifiutando] = useState(false);
  const [motivo, setMotivo] = useState("");
  return (
    <>
      <button className="ad-back" onClick={onIndietro}><ArrowLeft size={16} /> Torna all'elenco</button>

      <div className="ad-card">
        <div className="ad-dhead">
          <div className="ad-av ad-av-big">{iniziali(f.nome)}</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="ad-fname ad-display">{f.nome}</div>
            <div className="ad-frole">{f.ruolo} · <span className="ad-cat">{CAT_LABEL[f.categoria] || f.categoria}</span></div>
            <div className="ad-meta">
              {f.localita && <span><MapPin size={13} /> {f.localita}</span>}
              {f.email && <span><Mail size={13} /> {f.email}</span>}
              {f.telefono && <span><Phone size={13} /> {f.telefono}</span>}
              <span><Calendar size={13} /> iscritto il {f.created_at ? new Date(f.created_at).toLocaleDateString("it-IT") : "-"}</span>
            </div>
            <div className="ad-meta" style={{ marginTop: 8 }}>
              {f.link
                ? <span><LinkIcon size={14} /> <a href={f.link} target="_blank" rel="noreferrer">Apri profilo / social ↗</a></span>
                : <span style={{ color: "var(--warn)", fontWeight: 600 }}><LinkIcon size={14} /> Nessun link fornito — difficile verificarlo</span>}
            </div>
          </div>
        </div>

        {f.stato === "sospeso" && f.motivo_rifiuto && (
          <div className="ad-propose">
            <X size={16} />
            <span><b>Rifiutato in precedenza:</b> {f.motivo_rifiuto}</span>
          </div>
        )}

        {proposta && (
          <div className="ad-propose">
            <Lightbulb size={17} />
            <span>Ha proposto una <b>nuova categoria</b>: "{proposta}". Se la approvi, ricordati di aggiungerla alle categorie del sito.</span>
          </div>
        )}

        <div className="ad-sec">
          <h5>Foto ({f.foto?.length || 0})</h5>
          {f.foto?.length ? (
            <div className="ad-gal">
              {f.foto.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer"><img src={u} alt={`Foto ${i + 1}`} /></a>
              ))}
            </div>
          ) : <p className="ad-vuoto">Nessuna foto caricata.</p>}
          {f.video_link && (
            <p style={{ marginTop: 10, fontSize: 13.5 }}>
              <Video size={14} style={{ verticalAlign: "-2px" }} />{" "}
              <a href={f.video_link} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>Guarda il video ↗</a>
            </p>
          )}
        </div>

        <div className="ad-sec">
          <h5>Pacchetti ({f.pacchetti?.length || 0})</h5>
          {f.pacchetti?.length ? f.pacchetti.map((p) => (
            <div key={p.id} className="ad-pkg">
              <b>{p.label} — {p.base} €</b>
              <small>
                {p.evento === "Tutti" ? "Ogni evento" : p.evento}
                {p.scale_on !== "fisso" ? ` · scala su ${p.scale_on} (${p.inclusi} inclusi, +${p.extra_unita} € l'uno)` : " · prezzo fisso"}
                {p.includes ? <><br />{p.includes}</> : null}
                {p.descrizione ? <><br /><span style={{ color: "var(--ink)" }}>{p.descrizione}</span></> : null}
              </small>
            </div>
          )) : <p className="ad-vuoto">Nessun pacchetto inserito.</p>}
        </div>

        <div className="ad-sec">
          <h5>Extra</h5>
          {f.extra?.length ? (
            <div className="ad-chips">
              {f.extra.map((e) => <span key={e.id} className="ad-chip" title={e.descrizione || ""}>{e.label} · +{e.prezzo} €{e.descrizione ? " ⓘ" : ""}</span>)}
            </div>
          ) : <p className="ad-vuoto">Nessun extra.</p>}
        </div>

        <div className="ad-sec">
          <h5>Tariffe di zona{f.raggio_max ? ` · si sposta fino a ${f.raggio_max} km` : ""}</h5>
          {f.fasce?.length ? (
            <div className="ad-chips">
              {[...f.fasce].sort((a, b) => a.fino_a_km - b.fino_a_km).map((fa) => (
                <span key={fa.id} className="ad-chip">
                  <Navigation size={11} style={{ verticalAlign: "-1px" }} />{" "}
                  entro {fa.fino_a_km} km: {fa.fee === 0 ? "incluso" : `+${fa.fee} €`}
                </span>
              ))}
            </div>
          ) : <p className="ad-vuoto">Nessuna fascia impostata.</p>}
        </div>
      </div>

      {rifiutando && (
        <div className="ad-card">
          <h5 style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--grigio)", marginBottom: 10 }}>
            Perché non lo pubblichi?
          </h5>
          <p style={{ fontSize: 13.5, color: "var(--grigio)", marginBottom: 12 }}>
            Il motivo viene inviato per email al professionista, così può correggere e rimandare il profilo in verifica.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
            {MOTIVI.map((m) => (
              <button key={m} className={"ad-btn" + (motivo === m ? " ok" : "")}
                      style={{ justifyContent: "flex-start", textAlign: "left", fontWeight: 500 }}
                      onClick={() => setMotivo(m)}>
                {m}
              </button>
            ))}
          </div>
          <textarea rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Oppure scrivi il motivo con parole tue…"
                    style={{ width: "100%", border: "1px solid var(--linea)", borderRadius: 10, padding: 11, font: "500 14px 'Work Sans', sans-serif", color: "var(--ink)", outlineColor: "var(--accent)" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button className="ad-btn no" disabled={busy || !motivo.trim()}
                    onClick={() => { onRifiuta(f, motivo.trim()); setRifiutando(false); setMotivo(""); }}>
              <X size={16} /> Invia il rifiuto
            </button>
            <button className="ad-btn" onClick={() => { setRifiutando(false); setMotivo(""); }}>Annulla</button>
          </div>
        </div>
      )}

      <div className="ad-actions">
        {f.stato === "in_attesa" ? (
          <>
            <button className="ad-btn ok" disabled={busy} onClick={() => onApprova(f)}><Check size={16} /> Approva e pubblica</button>
            {!rifiutando && <button className="ad-btn no" disabled={busy} onClick={() => setRifiutando(true)}><X size={16} /> Rifiuta…</button>}
          </>
        ) : (
          !rifiutando && <button className="ad-btn no" disabled={busy} onClick={() => setRifiutando(true)}><X size={16} /> Sospendi (togli dal sito)</button>
        )}
        <label className="ad-verif">
          <input type="checkbox" checked={!!f.verificato} disabled={busy} onChange={() => onVerif(f)} />
          <ShieldCheck size={16} /> Verificato
        </label>
      </div>
    </>
  );
}

export default function Admin() {
  const [stato, setStato] = useState("check");
  const [tab, setTab] = useState("attesa");
  const [fornitori, setFornitori] = useState([]);
  const [modifiche, setModifiche] = useState([]);
  const [apertoId, setApertoId] = useState(null);
  const [cerca, setCerca] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState("");

  const mostra = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const carica = async () => {
    const { data } = await supabase
      .from("fornitori")
      .select("*, pacchetti(*), extra(*), fasce(*)")
      .order("created_at", { ascending: false });
    setFornitori(data || []);
    const { data: mod } = await supabase
      .from("modifiche_profilo")
      .select("*, fornitori(id, nome, ruolo, categoria, link, foto)")
      .eq("stato", "in_attesa")
      .order("created_at", { ascending: false });
    setModifiche(mod || []);
  };

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setStato("nonloggato"); return; }
      const { data: admin } = await supabase.rpc("is_admin");
      if (!admin) { setStato("nonadmin"); return; }
      await carica();
      setStato("ok");
    })();
  }, []);

  const azione = async (f, campi, msg) => {
    setBusyId(f.id);
    const { error } = await supabase.from("fornitori").update(campi).eq("id", f.id);
    setBusyId(null);
    if (error) { mostra("Errore: " + error.message); return; }
    if (msg) mostra(msg);
    await carica();
  };
  const approva = (f) => { azione(f, { stato: "approvato", motivo_rifiuto: null }, `${f.nome} è ora online! 🎉`); setApertoId(null); };
  const rifiuta = (f, motivo) => { azione(f, { stato: "sospeso", motivo_rifiuto: motivo || null }, `${f.nome}: rifiuto inviato.`); setApertoId(null); };
  const verif = (f) => azione(f, { verificato: !f.verificato }, null);

  const approvaModifica = async (m) => {
    setBusyId("m" + m.id);
    const { data, error } = await supabase.rpc("approva_modifica", { p_id: m.id });
    setBusyId(null);
    if (error || !data?.ok) { mostra("Errore nell'approvazione"); return; }
    mostra("Modifica pubblicata ✓");
    await carica();
  };
  const rifiutaModifica = async (m) => {
    setBusyId("m" + m.id);
    const { data, error } = await supabase.rpc("rifiuta_modifica", { p_id: m.id, p_motivo: null });
    setBusyId(null);
    if (error || !data?.ok) { mostra("Errore"); return; }
    mostra("Modifica rifiutata");
    await carica();
  };

  if (stato === "check") return <div className="ad-root"><Style /><div className="ad-center"><Loader2 size={26} className="ad-spin" /><p style={{ marginTop: 10 }}>Verifico l'accesso…</p></div></div>;
  if (stato === "nonloggato") return <div className="ad-root"><Style /><div className="ad-center"><p style={{ marginBottom: 14 }}>Devi accedere per entrare nell'area amministratore.</p><a href="/?accedi" className="ad-btn ok" style={{ textDecoration: "none" }}>Vai al login</a></div></div>;
  if (stato === "nonadmin") return <div className="ad-root"><Style /><div className="ad-center"><ShieldCheck size={30} style={{ marginBottom: 10, opacity: .5 }} /><p>Questa è un'area riservata all'amministratore.</p><a href="/" className="ad-link" style={{ marginTop: 12, display: "inline-block" }}>← Torna al sito</a></div></div>;

  const inAttesa = fornitori.filter((f) => f.stato === "in_attesa");
  const online = fornitori.filter((f) => f.stato === "approvato");
  const base = tab === "attesa" ? inAttesa : online;
  const q = cerca.trim().toLowerCase();
  const lista = q
    ? base.filter((f) => [f.nome, f.ruolo, f.localita, f.email].some((v) => (v || "").toLowerCase().includes(q)))
    : base;
  const aperto = fornitori.find((f) => f.id === apertoId);

  return (
    <div className="ad-root"><Style />
      <header className="ad-head">
        <div className="ad-wrap ad-headin">
          <div><a href="/" className="ad-logo">Click<em>Eventi</em></a><span className="ad-tag">Admin</span></div>
          <button className="ad-link" onClick={async () => { await supabase.auth.signOut(); location.href = "/"; }}>
            <LogOut size={14} /> Esci
          </button>
        </div>
      </header>

      <div className="ad-wrap">
        {aperto ? (
          <Dettaglio f={aperto} busy={busyId === aperto.id}
            onIndietro={() => setApertoId(null)}
            onApprova={approva} onRifiuta={rifiuta} onVerif={verif} />
        ) : (
          <>
            <div className="ad-tabs">
              <button className={"ad-tab" + (tab === "attesa" ? " on" : "")} onClick={() => setTab("attesa")}>
                <Inbox size={15} /> Da approvare {inAttesa.length > 0 && <span className="ad-badge">{inAttesa.length}</span>}
              </button>
              <button className={"ad-tab" + (tab === "online" ? " on" : "")} onClick={() => setTab("online")}>
                <Users size={15} /> Online ({online.length})
              </button>
              <div className="ad-search">
                <Search size={15} />
                <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca nome, città…" />
              </div>
            </div>

            {tab === "modifiche" ? (
              modifiche.length === 0 ? (
                <div className="ad-empty">Nessuna modifica in attesa di verifica.</div>
              ) : (
                modifiche.map((m) => {
                  const vecchio = m.fornitori || {};
                  const nuovo = m.dati || {};
                  const campi = [
                    ["Nome", vecchio.nome, nuovo.nome],
                    ["Attività", vecchio.ruolo, nuovo.ruolo],
                    ["Categoria", CAT_LABEL[vecchio.categoria] || vecchio.categoria,
                      nuovo.categoria ? (CAT_LABEL[nuovo.categoria] || nuovo.categoria) : undefined],
                    ["Link", vecchio.link, nuovo.link],
                  ].filter(([, , n]) => n !== undefined && n !== null);
                  const fotoNuove = nuovo.foto;
                  return (
                    <div key={m.id} className="ad-card">
                      <div className="ad-fname ad-display" style={{ fontSize: 18, marginBottom: 4 }}>
                        {vecchio.nome}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--grigio)", marginBottom: 14 }}>
                        Modifica proposta il {new Date(m.created_at).toLocaleDateString("it-IT")} · il profilo online mostra ancora la versione attuale
                      </p>

                      {campi.map(([etichetta, prima, dopo]) => (
                        <div key={etichetta} style={{ marginBottom: 12 }}>
                          <h5 style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--grigio)", marginBottom: 6 }}>{etichetta}</h5>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div style={{ background: "var(--bg2)", borderRadius: 9, padding: "9px 12px", fontSize: 14, color: "var(--grigio)", textDecoration: "line-through" }}>
                              {prima || "—"}
                            </div>
                            <div style={{ background: "var(--ok-soft)", borderRadius: 9, padding: "9px 12px", fontSize: 14, fontWeight: 600, color: "var(--ok)" }}>
                              {dopo || "—"}
                            </div>
                          </div>
                        </div>
                      ))}

                      {fotoNuove && (
                        <div style={{ marginBottom: 12 }}>
                          <h5 style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--grigio)", marginBottom: 6 }}>Nuove foto ({fotoNuove.length})</h5>
                          <div className="ad-gal">
                            {fotoNuove.map((u, i) => (
                              <a key={i} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" /></a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                        <button className="ad-btn ok" disabled={busyId === "m" + m.id} onClick={() => approvaModifica(m)}>
                          <Check size={16} /> Pubblica la modifica
                        </button>
                        <button className="ad-btn no" disabled={busyId === "m" + m.id} onClick={() => rifiutaModifica(m)}>
                          <X size={16} /> Rifiuta
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : lista.length === 0 ? (
              <div className="ad-empty">
                {q ? "Nessun risultato per questa ricerca."
                   : tab === "attesa" ? "Nessun professionista in attesa. Quando qualcuno si iscrive, comparirà qui."
                   : "Ancora nessun professionista pubblicato."}
              </div>
            ) : (
              <div className="ad-list">
                {lista.map((f) => <Riga key={f.id} f={f} onApri={(x) => { setApertoId(x.id); window.scrollTo(0, 0); }} />)}
              </div>
            )}
            <div style={{ height: 40 }} />
          </>
        )}
      </div>

      {toast && <div className="ad-toast">{toast}</div>}
    </div>
  );
}
