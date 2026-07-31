import { useState, useEffect } from "react";
import {
  Check, X, Clock, MapPin, Phone, Mail, Package, Navigation, Star,
  ShieldCheck, Loader2, LogOut, Inbox, Users, Lightbulb, Link as LinkIcon
} from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — Area amministratore (solo Susanna)
   Vede i fornitori "in attesa", ne controlla il profilo completo
   e li approva / rifiuta. Gestisce anche il badge Verificato.
   Protetta: accessibile solo a chi è nella tabella admins.
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
    .ad-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .ad-wrap{max-width:860px;margin:0 auto;padding:0 20px;width:100%}
    .ad-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .ad-logo em{font-style:normal;color:var(--accent)}
    .ad-headin{display:flex;align-items:center;justify-content:space-between}
    .ad-tag{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:3px 10px;margin-left:10px}
    .ad-link{background:none;border:none;color:var(--grigio);font:600 13px 'Work Sans';cursor:pointer;display:inline-flex;align-items:center;gap:6px}
    .ad-tabs{display:flex;gap:8px;margin:24px 0 18px}
    .ad-tab{font:600 13.5px 'Work Sans';color:var(--grigio);background:#fff;border:1px solid var(--linea);border-radius:999px;padding:9px 16px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
    .ad-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    .ad-badge{background:var(--accent);color:#fff;border-radius:999px;font-size:11px;font-weight:700;padding:1px 7px}
    .ad-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:22px;margin-bottom:14px}
    .ad-fhead{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start}
    .ad-fname{font-family:'Sora',sans-serif;font-size:18px;font-weight:700}
    .ad-frole{color:var(--grigio);font-size:14px;margin-top:2px}
    .ad-meta{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--grigio);margin:12px 0}
    .ad-meta span{display:inline-flex;align-items:center;gap:6px}
    .ad-cat{display:inline-block;background:var(--accent-soft);color:var(--accent);border-radius:999px;font-size:12px;font-weight:600;padding:3px 10px}
    .ad-propose{background:var(--warn-soft);color:var(--warn);border-radius:10px;padding:10px 12px;font-size:13px;margin:10px 0;display:flex;gap:8px;align-items:flex-start}
    .ad-sec{border-top:1px solid var(--linea);margin-top:14px;padding-top:14px}
    .ad-sec h5{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--grigio);margin-bottom:8px}
    .ad-pkg{border:1px solid var(--linea);border-radius:10px;padding:10px 12px;margin-bottom:8px}
    .ad-pkg b{font-size:14px}
    .ad-pkg small{color:var(--grigio);font-size:12.5px;display:block;margin-top:2px}
    .ad-chips{display:flex;flex-wrap:wrap;gap:6px}
    .ad-chip{background:var(--bg2);border:1px solid var(--linea);border-radius:999px;font-size:12px;padding:3px 9px}
    .ad-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
    .ad-btn{display:inline-flex;align-items:center;gap:7px;font:600 13.5px 'Work Sans';border-radius:10px;padding:10px 16px;cursor:pointer;border:1px solid var(--linea);background:#fff;color:var(--ink)}
    .ad-btn.ok{background:var(--ok);border-color:var(--ok);color:#fff}
    .ad-btn.no{background:#fff;border-color:#E0B0B0;color:#B44848}
    .ad-btn:hover{filter:brightness(.97)}
    .ad-btn:disabled{opacity:.5;cursor:default}
    .ad-verif{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--grigio);cursor:pointer;margin-left:auto}
    .ad-verif input{accent-color:var(--accent);width:16px;height:16px}
    .ad-empty{background:#fff;border:1px dashed var(--linea);border-radius:16px;padding:44px 24px;text-align:center;color:var(--grigio)}
    .ad-center{text-align:center;padding:70px 20px;color:var(--grigio)}
    .ad-spin{animation:ad-rot 1s linear infinite}@keyframes ad-rot{to{transform:rotate(360deg)}}
    .ad-toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.2)}
  `}</style>
);

function estraiCategoriaProposta(bio) {
  if (bio && bio.startsWith("Categoria proposta dal fornitore:")) {
    return bio.replace("Categoria proposta dal fornitore:", "").trim();
  }
  return null;
}

function ForniCard({ f, onApprova, onRifiuta, onVerif, busy }) {
  const proposta = estraiCategoriaProposta(f.bio);
  return (
    <div className="ad-card">
      <div className="ad-fhead">
        <div>
          <div className="ad-fname ad-display">{f.nome}</div>
          <div className="ad-frole">{f.ruolo} · <span className="ad-cat">{CAT_LABEL[f.categoria] || f.categoria}</span></div>
        </div>
        {f.stato === "approvato" && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ok)", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Check size={14} /> Online{f.verificato ? " · Verificato" : ""}
          </span>
        )}
      </div>

      <div className="ad-meta">
        {f.localita && <span><MapPin size={13} /> {f.localita}</span>}
        {f.email && <span><Mail size={13} /> {f.email}</span>}
        {f.telefono && <span><Phone size={13} /> {f.telefono}</span>}
        {f.link && <span><LinkIcon size={13} /> <a href={f.link} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>Vedi profilo/social ↗</a></span>}
      </div>

      {proposta && (
        <div className="ad-propose">
          <Lightbulb size={16} />
          <span>Ha proposto una <b>nuova categoria</b>: "{proposta}". Se la approvi, ricordati di aggiungerla alle categorie del sito.</span>
        </div>
      )}

      {f.pacchetti?.length > 0 && (
        <div className="ad-sec">
          <h5>Pacchetti ({f.pacchetti.length})</h5>
          {f.pacchetti.map((p) => (
            <div key={p.id} className="ad-pkg">
              <b>{p.label} — {p.base} €</b>
              <small>
                {p.evento === "Tutti" ? "Ogni evento" : p.evento}
                {p.scale_on !== "fisso" ? ` · scala su ${p.scale_on} (${p.inclusi} inclusi, +${p.extra_unita}€)` : " · prezzo fisso"}
                {p.includes ? ` · ${p.includes}` : ""}
              </small>
            </div>
          ))}
        </div>
      )}

      {f.extra?.length > 0 && (
        <div className="ad-sec">
          <h5>Extra</h5>
          <div className="ad-chips">
            {f.extra.map((e) => <span key={e.id} className="ad-chip">{e.label} +{e.prezzo}€</span>)}
          </div>
        </div>
      )}

      {f.fasce?.length > 0 && (
        <div className="ad-sec">
          <h5>Tariffe di zona</h5>
          <div className="ad-chips">
            {[...f.fasce].sort((a, b) => a.fino_a_km - b.fino_a_km).map((fa) => (
              <span key={fa.id} className="ad-chip">
                <Navigation size={11} style={{ verticalAlign: "-1px" }} /> {fa.fino_a_km >= 9999 ? "oltre" : `entro ${fa.fino_a_km} km`}: {fa.fee === 0 ? "incluso" : `+${fa.fee}€`}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="ad-actions">
        {f.stato === "in_attesa" ? (
          <>
            <button className="ad-btn ok" disabled={busy} onClick={() => onApprova(f)}>
              <Check size={15} /> Approva e pubblica
            </button>
            <button className="ad-btn no" disabled={busy} onClick={() => onRifiuta(f)}>
              <X size={15} /> Rifiuta
            </button>
          </>
        ) : (
          <button className="ad-btn no" disabled={busy} onClick={() => onRifiuta(f)}>
            <X size={15} /> Sospendi (togli dal sito)
          </button>
        )}
        <label className="ad-verif">
          <input type="checkbox" checked={!!f.verificato} disabled={busy} onChange={() => onVerif(f)} />
          <ShieldCheck size={15} /> Verificato
        </label>
      </div>
    </div>
  );
}

export default function Admin() {
  const [stato, setStato] = useState("check"); // check | nonloggato | nonadmin | ok
  const [tab, setTab] = useState("attesa");
  const [fornitori, setFornitori] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState("");

  const mostra = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const carica = async () => {
    const { data } = await supabase
      .from("fornitori")
      .select("*, pacchetti(*), extra(*), fasce(*)")
      .order("created_at", { ascending: false });
    setFornitori(data || []);
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

  const approva = async (f) => {
    setBusyId(f.id);
    const { error } = await supabase.from("fornitori").update({ stato: "approvato" }).eq("id", f.id);
    setBusyId(null);
    if (error) { mostra("Errore: " + error.message); return; }
    mostra(`${f.nome} è ora online! 🎉`);
    carica();
  };
  const rifiuta = async (f) => {
    setBusyId(f.id);
    const { error } = await supabase.from("fornitori").update({ stato: "sospeso" }).eq("id", f.id);
    setBusyId(null);
    if (error) { mostra("Errore: " + error.message); return; }
    mostra(`${f.nome} sospeso.`);
    carica();
  };
  const verif = async (f) => {
    setBusyId(f.id);
    const { error } = await supabase.from("fornitori").update({ verificato: !f.verificato }).eq("id", f.id);
    setBusyId(null);
    if (error) { mostra("Errore: " + error.message); return; }
    carica();
  };

  if (stato === "check") {
    return <div className="ad-root"><Style /><div className="ad-center"><Loader2 size={26} className="ad-spin" /><p style={{ marginTop: 10 }}>Verifico l'accesso…</p></div></div>;
  }
  if (stato === "nonloggato") {
    return <div className="ad-root"><Style /><div className="ad-center">
      <p style={{ marginBottom: 14 }}>Devi accedere per entrare nell'area amministratore.</p>
      <a href="/?accedi" className="ad-btn ok" style={{ textDecoration: "none" }}>Vai al login</a>
    </div></div>;
  }
  if (stato === "nonadmin") {
    return <div className="ad-root"><Style /><div className="ad-center">
      <ShieldCheck size={30} style={{ marginBottom: 10, opacity: .5 }} />
      <p>Questa è un'area riservata all'amministratore.</p>
      <a href="/" className="ad-link" style={{ marginTop: 12, display: "inline-block", textDecoration: "none" }}>← Torna al sito</a>
    </div></div>;
  }

  const inAttesa = fornitori.filter((f) => f.stato === "in_attesa");
  const online = fornitori.filter((f) => f.stato === "approvato");
  const lista = tab === "attesa" ? inAttesa : online;

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
        <div className="ad-tabs">
          <button className={"ad-tab" + (tab === "attesa" ? " on" : "")} onClick={() => setTab("attesa")}>
            <Inbox size={15} /> Da approvare {inAttesa.length > 0 && <span className="ad-badge">{inAttesa.length}</span>}
          </button>
          <button className={"ad-tab" + (tab === "online" ? " on" : "")} onClick={() => setTab("online")}>
            <Users size={15} /> Online ({online.length})
          </button>
        </div>

        {lista.length === 0 ? (
          <div className="ad-empty">
            {tab === "attesa"
              ? "Nessun professionista in attesa. Quando qualcuno si iscrive, comparirà qui."
              : "Ancora nessun professionista pubblicato."}
          </div>
        ) : (
          lista.map((f) => (
            <ForniCard key={f.id} f={f} busy={busyId === f.id}
              onApprova={approva} onRifiuta={rifiuta} onVerif={verif} />
          ))
        )}
        <div style={{ height: 40 }} />
      </div>

      {toast && <div className="ad-toast">{toast}</div>}
    </div>
  );
}
