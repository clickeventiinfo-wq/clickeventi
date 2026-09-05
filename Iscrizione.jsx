import { useState, useEffect } from "react";
import {
  Music, Camera, Martini, PartyPopper, Sparkles,
  Check, ArrowLeft, ArrowRight, Plus, Trash2, PartyPopper as Party, Loader2, Mail, Link as LinkIcon, ImagePlus, X, Video
} from "lucide-react";
import { supabase } from "./supabase";
import { ComuneInput, ComuniMultipli } from "./comuni.jsx";

/* ============================================================
   CLICK EVENTI — Iscrizione professionista (2 fasi)
   FASE 1: crea account (email + password) → conferma email
   FASE 2 (rientra loggato): completa profilo, pacchetti, link
   Salvando da loggato, i permessi (RLS) funzionano correttamente.
   ============================================================ */

const CATEGORIES = [
  { id: "musica", label: "Musica", icon: Music },
  { id: "foto", label: "Foto & Video", icon: Camera },
  { id: "barman", label: "Beverage", icon: Martini },
  { id: "animazione", label: "Animazione", icon: PartyPopper },
  { id: "beauty", label: "Hair & Beauty", icon: Sparkles },
];
const EVENT_OPTS = ["Ogni evento", "Compleanno", "18esimo", "Festa privata", "Laurea", "Evento aziendale", "Evento pubblico", "Matrimonio"];
const SCALE_OPTS = [
  { id: "fisso", label: "Prezzo fisso" },
  { id: "ore", label: "A ore", inclLabel: "Ore incluse", extraLabel: "€ / ora in più" },
  { id: "ospiti", label: "A numero di ospiti", inclLabel: "Ospiti inclusi", extraLabel: "€ / ospite in più" },
  { id: "persone", label: "A persona", inclLabel: "Persone incluse", extraLabel: "€ / persona in più" },
];
const scaleOpt = (id) => SCALE_OPTS.find((s) => s.id === id);
const pacchettoVuoto = () => ({ label: "", event: "Ogni evento", base: "", includes: "", descrizione: "", scaleOn: "fisso", included: "", extra: "" });

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg:#fff;--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .is-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .is-display{font-family:'Sora',sans-serif}
    .is-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .is-wrap{max-width:640px;margin:0 auto;padding:0 20px}
    .is-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .is-logo em{font-style:normal;color:var(--accent)}
    .is-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:24px;margin:22px 0}
    .is-steps{display:flex;gap:8px;margin:24px 0 4px}
    .is-stepdot{flex:1;height:5px;border-radius:999px;background:var(--linea)}
    .is-stepdot.on{background:var(--accent)}
    .is-eyebrow{font:600 12px 'Work Sans';letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:6px}
    h1.is-t{font-family:'Sora',sans-serif;font-size:26px;font-weight:700;margin-bottom:6px}
    .is-sub{color:var(--grigio);font-size:14.5px;margin-bottom:8px}
    label{display:block;font-size:13px;font-weight:600;margin:14px 0 5px}
    input,select,textarea{width:100%;border:1px solid var(--linea);border-radius:10px;font:500 14px 'Work Sans';padding:11px 12px;background:#fff;color:var(--ink);outline-color:var(--accent)}
    .is-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .is-cats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:6px}
    .is-cat{border:1.5px solid var(--linea);border-radius:12px;padding:12px 6px;text-align:center;cursor:pointer;font-size:12.5px;font-weight:600}
    .is-cat.on{border-color:var(--accent);background:var(--accent-soft);color:var(--accent)}
    .is-cat svg{display:block;margin:0 auto 6px}
    .is-pkg{border:1px solid var(--linea);border-radius:12px;padding:16px;margin-top:12px;position:relative}
    .is-pkg-del{position:absolute;top:12px;right:12px;background:none;border:none;color:var(--grigio);cursor:pointer}
    .is-addpkg{display:inline-flex;align-items:center;gap:7px;background:var(--accent-soft);color:var(--accent);border:none;border-radius:10px;font:600 14px 'Work Sans';padding:11px 16px;cursor:pointer;margin-top:14px}
    .is-fascia{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:end;margin-bottom:10px}
    .is-nav{display:flex;justify-content:space-between;gap:10px;margin-top:22px}
    .is-btn{display:inline-flex;align-items:center;gap:8px;border-radius:11px;font:600 15px 'Work Sans';padding:12px 22px;cursor:pointer;border:1px solid var(--linea);background:#fff;color:var(--ink);text-decoration:none}
    .is-btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
    .is-btn.primary:hover{background:#7A5CE8}
    .is-btn:disabled{opacity:.5;cursor:default}
    .is-err{color:#C0392B;font-size:13px;margin-top:12px;font-weight:600}
    .is-hint{font-size:12px;color:var(--grigio);margin-top:6px}
    .is-ok{text-align:center;padding:40px 20px}
    .is-ok svg{color:var(--accent);margin-bottom:14px}
    .is-mailbox{width:64px;height:64px;border-radius:16px;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
    .is-spin{animation:is-rot 1s linear infinite}@keyframes is-rot{to{transform:rotate(360deg)}}
    .is-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px}
    .is-foto{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;border:1px solid var(--linea);background:var(--bg2)}
    .is-foto img{width:100%;height:100%;object-fit:cover;display:block}
    .is-foto button{position:absolute;top:6px;right:6px;background:rgba(35,32,58,.75);border:none;color:#fff;border-radius:8px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .is-add{aspect-ratio:1;border:1.5px dashed var(--accent);border-radius:12px;background:var(--accent-soft);color:var(--accent);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;font:600 12.5px 'Work Sans';text-align:center;padding:8px}
    .is-add:hover{background:#EDE7FE}
    .is-cover{position:absolute;bottom:6px;left:6px;background:var(--accent);color:#fff;font:700 10.5px 'Work Sans';padding:2px 8px;border-radius:999px}
    @media(max-width:560px){.is-cats{grid-template-columns:repeat(2,1fr)}.is-row{grid-template-columns:1fr}}
  `}</style>
);

const Header = () => (
  <header className="is-head">
    <div className="is-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <a href="/" className="is-logo">Click<em>Eventi</em></a>
      <a href="/?accedi" style={{ fontSize: 13, fontWeight: 600, color: "var(--grigio)", textDecoration: "none" }}>Hai già un account? Accedi</a>
    </div>
  </header>
);

/* ============ FASE 1 — crea account ============ */
function CreaAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");
  const [inviato, setInviato] = useState(false);
  const [giaRegistrato, setGiaRegistrato] = useState(false);

  const emailValida = (e) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e.trim());

  const registra = async () => {
    const mail = email.trim();
    if (!mail) { setErrore("Scrivi la tua email per continuare."); return; }
    if (!emailValida(mail)) {
      setErrore("Inserisci un indirizzo e-mail valido");
      return;
    }
    if (!password) { setErrore("Scegli una password per il tuo account."); return; }
    if (password.length < 6) { setErrore("La password è troppo corta: servono almeno 6 caratteri."); return; }
    setErrore(""); setSaving(true);
    const { data, error } = await supabase.auth.signUp({
      email: mail, password,
      options: { emailRedirectTo: "https://clickeventi.it/?iscrizione" },
    });
    setSaving(false);

    /* Supabase, per non rivelare quali indirizzi sono registrati, risponde
       "ok" anche se l'account esiste già: si riconosce dal fatto che non
       viene restituita nessuna identità. In quel caso avvisiamo l'utente. */
    if (!error && data?.user && (data.user.identities?.length ?? 0) === 0) {
      setGiaRegistrato(true);
      return;
    }

    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("registered") || m.includes("already"))
        setErrore("Questa email è già registrata. Vai su \"Accedi\" per entrare, oppure usa \"Password dimenticata\".");
      else if (m.includes("invalid") && m.includes("email"))
        setErrore("Inserisci un indirizzo e-mail valido");
      else if (m.includes("password"))
        setErrore("La password non va bene: scegline una di almeno 6 caratteri.");
      else if (m.includes("rate") || m.includes("many") || m.includes("seconds"))
        setErrore("Hai fatto troppi tentativi ravvicinati. Aspetta un minuto e riprova.");
      else
        setErrore("Non siamo riusciti a creare l'account. Riprova tra poco: se il problema resta, scrivici a info@clickeventi.it");
      return;
    }
    setInviato(true);
  };

  if (giaRegistrato) {
    return (
      <div className="is-card is-ok">
        <div className="is-mailbox"><Mail size={30} /></div>
        <h1 className="is-t is-display">Hai già un account</h1>
        <p className="is-sub" style={{ maxWidth: 440, margin: "8px auto 0" }}>
          L'indirizzo <b>{email}</b> è già registrato su Click Eventi.
          Accedi con la tua password, oppure recuperala se non la ricordi.
        </p>
        <div className="is-nav" style={{ justifyContent: "center", gap: 10 }}>
          <a href="/?accedi" className="is-btn primary">Vai al login</a>
          <button className="is-btn" onClick={() => { setGiaRegistrato(false); setEmail(""); setPassword(""); }}>
            Usa un'altra email
          </button>
        </div>
      </div>
    );
  }

  if (inviato) {
    return (
      <div className="is-card is-ok">
        <div className="is-mailbox"><Mail size={30} /></div>
        <h1 className="is-t is-display">Controlla la tua email 📬</h1>
        <p className="is-sub" style={{ maxWidth: 440, margin: "8px auto 0" }}>
          Ti abbiamo scritto a <b>{email}</b>. Clicca il link di conferma: tornerai qui
          già connesso e potrai completare il tuo profilo (foto, pacchetti, link).
        </p>
        <p className="is-hint" style={{ marginTop: 16 }}>Non trovi l'email? Controlla nello spam.</p>
      </div>
    );
  }

  return (
    <div className="is-card">
      <div className="is-eyebrow">Passo 1 · Crea il tuo account</div>
      <h1 className="is-t is-display">Diventa un professionista</h1>
      <p className="is-sub">Inizia con email e password. Poi confermi l'email e completi il profilo.</p>
      <label>Email *</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="La userai per accedere" />
      <label>Password *</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
             placeholder="Almeno 6 caratteri" onKeyDown={(e) => e.key === "Enter" && registra()} />
      {errore && <div className="is-err">{errore}</div>}
      <div className="is-nav">
        <a href="/" className="is-btn">Annulla</a>
        <button className="is-btn primary" onClick={registra} disabled={saving}>
          {saving ? <><Loader2 size={16} className="is-spin" /> Invio…</> : <>Continua <ArrowRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

/* ============ FASE 2 — completa profilo (loggato) ============ */
function CompletaProfilo({ user }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");
  const [fatto, setFatto] = useState(false);

  const [d, setD] = useState({ nome: "", ruolo: "", categoria: "", nuovaCat: "", telefono: "", link: "" });
  const [comune, setComune] = useState(null);   // {name, area, lat, lng}
  const [zone, setZone] = useState([]);        // altre zone di lavoro
  const [pacchetti, setPacchetti] = useState([pacchettoVuoto()]);
  const [extra, setExtra] = useState([]);
  const [fasce, setFasce] = useState([{ fino: 30, fee: 0 }, { fino: 100, fee: "" }]);
  const [raggio, setRaggio] = useState(150);
  const [foto, setFoto] = useState([]);          // {url, path}
  const [videoLink, setVideoLink] = useState("");
  const [caricando, setCaricando] = useState(false);

  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const so = (id) => scaleOpt(id);

  const validStep1 = () => {
    if (!d.nome || !d.ruolo) return "Compila nome e cosa fai.";
    if (!comune) return "Scegli il tuo comune dall'elenco dei suggerimenti.";
    if (!d.categoria) return "Scegli una categoria.";
    if (d.categoria === "altro" && !d.nuovaCat) return "Scrivi il nome della categoria che proponi.";
    return "";
  };
  const validStep2 = () => {
    const p = pacchetti[0];
    if (!p.label || !p.base) return "Inserisci almeno un pacchetto con nome e prezzo.";
    return "";
  };
  const validStep3 = () => {
    if (foto.length === 0) return "Carica almeno una foto: serve ai clienti per sceglierti.";
    return "";
  };
  const avanti = () => {
    const err = step === 1 ? validStep1() : step === 2 ? validStep2() : step === 3 ? validStep3() : "";
    if (err) { setErrore(err); return; }
    setErrore(""); setStep(step + 1);
  };
  const indietro = () => { setErrore(""); setStep(step - 1); };

  const addPkg = () => setPacchetti([...pacchetti, pacchettoVuoto()]);
  const delPkg = (i) => setPacchetti(pacchetti.filter((_, x) => x !== i));
  const upPkg = (i, k, v) => setPacchetti(pacchetti.map((p, x) => x === i ? { ...p, [k]: v } : p));
  const addExtra = () => setExtra([...extra, { label: "", price: "", descrizione: "" }]);
  const delExtra = (i) => setExtra(extra.filter((_, x) => x !== i));
  const upExtra = (i, k, v) => setExtra(extra.map((e, x) => x === i ? { ...e, [k]: v } : e));
  const upFascia = (i, campo, v) => setFasce(fasce.map((f, x) => x === i ? { ...f, [campo]: v } : f));
  const addFascia = () => setFasce([...fasce, { fino: "", fee: "" }]);
  const delFascia = (i) => setFasce(fasce.filter((_, x) => x !== i));

  const caricaFoto = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setErrore(""); setCaricando(true);
    for (const file of files) {
      if (foto.length >= 6) break;
      if (file.size > 5 * 1024 * 1024) { setErrore(`"${file.name}" supera 5 MB: scegli un'immagine più leggera.`); continue; }
      const est = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${est}`;
      const { error } = await supabase.storage.from("foto").upload(path, file, { upsert: false });
      if (error) { setErrore("Errore nel caricamento: " + error.message); continue; }
      const { data } = supabase.storage.from("foto").getPublicUrl(path);
      setFoto((f) => [...f, { url: data.publicUrl, path }]);
    }
    setCaricando(false);
    e.target.value = "";
  };

  const rimuoviFoto = async (i) => {
    const f = foto[i];
    setFoto((cur) => cur.filter((_, x) => x !== i));
    if (f?.path) await supabase.storage.from("foto").remove([f.path]);
  };

  const invia = async () => {
    setErrore(""); setSaving(true);
    const categoriaFinale = d.categoria === "altro" ? "musica" : d.categoria;
    // recupera la riga fornitore creata dal trigger
    const { data: forn } = await supabase.from("fornitori").select("id").eq("user_id", user.id).maybeSingle();
    if (!forn?.id) { setSaving(false); setErrore("Profilo non trovato. Ricarica la pagina."); return; }
    const fid = forn.id;

    const noteBio = d.categoria === "altro" ? ("Categoria proposta dal fornitore: " + d.nuovaCat) : null;
    const { error: e1 } = await supabase.from("fornitori").update({
      nome: d.nome, ruolo: d.ruolo, categoria: categoriaFinale,
      localita: comune.name, provincia: comune.area,
      lat: comune.lat, lng: comune.lng,
      zone: zone.filter(Boolean),
      raggio_max: Number(raggio) || 150,
      telefono: d.telefono, email: user.email,
      bio: noteBio, link: d.link || null,
      foto: foto.map((f) => f.url), video_link: videoLink || null,
    }).eq("id", fid);
    if (e1) { setSaving(false); setErrore("Errore nel salvataggio del profilo: " + e1.message); return; }

    const pkgRows = pacchetti.filter((p) => p.label && p.base).map((p) => ({
      fornitore_id: fid, label: p.label, evento: p.event, base: Number(p.base) || 0,
      includes: p.includes, descrizione: p.descrizione || null,
      scale_on: p.scaleOn, inclusi: Number(p.included) || 0, extra_unita: Number(p.extra) || 0,
    }));
    if (pkgRows.length) { const { error } = await supabase.from("pacchetti").insert(pkgRows); if (error) { setSaving(false); setErrore("Errore pacchetti: " + error.message); return; } }

    const exRows = extra.filter((e) => e.label && e.price).map((e) => ({ fornitore_id: fid, label: e.label, prezzo: Number(e.price) || 0, descrizione: e.descrizione || null }));
    if (exRows.length) await supabase.from("extra").insert(exRows);

    const faRows = fasce
      .filter((f) => f.fino !== "" && Number(f.fino) > 0)
      .map((f) => ({ fornitore_id: fid, fino_a_km: Number(f.fino), fee: Number(f.fee) || 0 }));
    if (faRows.length) await supabase.from("fasce").insert(faRows);

    setSaving(false); setFatto(true);
  };

  if (fatto) {
    return (
      <div className="is-card is-ok">
        <Party size={44} />
        <h1 className="is-t is-display">Profilo inviato! 🎉</h1>
        <p className="is-sub" style={{ maxWidth: 420, margin: "8px auto 0" }}>
          Il team Click Eventi verificherà il tuo profilo e lo pubblicherà. Ti avvisiamo appena sei online!
        </p>
        <a href="/?accedi" className="is-btn primary" style={{ marginTop: 20, display: "inline-flex" }}>Vai al mio account</a>
      </div>
    );
  }

  return (
    <>
      <div className="is-steps">{[1, 2, 3, 4].map((n) => <div key={n} className={"is-stepdot" + (step >= n ? " on" : "")} />)}</div>

      {step === 1 && (
        <div className="is-card">
          <div className="is-eyebrow">Passo 2 di 5 · Chi sei</div>
          <h1 className="is-t is-display">Il tuo profilo</h1>
          <p className="is-sub">Email confermata ✓ Ora raccontaci chi sei.</p>
          <label>Nome o nome d'arte *</label>
          <input value={d.nome} onChange={set("nome")} placeholder="Es. Elisa Quaranta" />
          <label>Cosa fai *</label>
          <input value={d.ruolo} onChange={set("ruolo")} placeholder="Es. Violinista, DJ, Fotografo…" />
          <label>Categoria *</label>
          <div className="is-cats">
            {CATEGORIES.map((c) => { const Icon = c.icon; return (
              <div key={c.id} className={"is-cat" + (d.categoria === c.id ? " on" : "")} onClick={() => setD({ ...d, categoria: c.id })}>
                <Icon size={20} strokeWidth={1.9} />{c.label}
              </div>); })}
          </div>
          <div className={"is-cat" + (d.categoria === "altro" ? " on" : "")} style={{ display: "inline-block", padding: "8px 14px", marginTop: 8 }} onClick={() => setD({ ...d, categoria: "altro" })}>
            + Proponi una nuova categoria
          </div>
          {d.categoria === "altro" && <input style={{ marginTop: 8 }} value={d.nuovaCat} onChange={set("nuovaCat")} placeholder="Es. Scenografie, Noleggio auto…" />}
          <div className="is-row">
            <div><label htmlFor="is-comune">Comune *</label><ComuniMultipli id="is-comune" principale={comune} zone={zone} onChange={({ principale, zone: z }) => { setComune(principale); setZone(z); }} /></div>
            <div><label>Telefono</label><input value={d.telefono} onChange={set("telefono")} placeholder="Per i clienti" /></div>
          </div>
          <label><LinkIcon size={13} style={{ verticalAlign: "-2px" }} /> Link (Instagram, sito, YouTube…)</label>
          <input value={d.link} onChange={set("link")} placeholder="https://instagram.com/iltuoprofilo" />
          <p className="is-hint">Serve al team per verificare che tu sia un professionista reale. Metti il link che ti rappresenta meglio.</p>
          {errore && <div className="is-err">{errore}</div>}
          <div className="is-nav">
            <span />
            <button className="is-btn primary" onClick={avanti}>Continua <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="is-card">
          <div className="is-eyebrow">Passo 3 di 5 · I tuoi pacchetti</div>
          <h1 className="is-t is-display">I tuoi pacchetti</h1>
          <p className="is-sub">Crea almeno un pacchetto. Potrai modificarli quando vuoi.</p>
          {pacchetti.map((p, i) => (
            <div key={i} className="is-pkg">
              {pacchetti.length > 1 && <button className="is-pkg-del" onClick={() => delPkg(i)}><Trash2 size={16} /></button>}
              <label>Nome del pacchetto *</label>
              <input value={p.label} onChange={(e) => upPkg(i, "label", e.target.value)} placeholder='Es. "Set acustico"' />
              <div className="is-row">
                <div><label>Per quale evento</label>
                  <select value={p.event} onChange={(e) => upPkg(i, "event", e.target.value)}>{EVENT_OPTS.map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><label>Prezzo base (€) *</label><input type="number" value={p.base} onChange={(e) => upPkg(i, "base", e.target.value)} /></div>
              </div>
              <label>Cosa include</label>
              <input value={p.includes} onChange={(e) => upPkg(i, "includes", e.target.value)} placeholder="Es. 1 ora · Impianto incluso" />
              <label>Descrizione pacchetto</label>
              <textarea rows={2} value={p.descrizione} onChange={(e) => upPkg(i, "descrizione", e.target.value)}
                        placeholder="Spiega cosa comprende davvero: cosa fai, come si svolge, cosa serve da parte del cliente…" />
              <label>Come scala il prezzo</label>
              <select value={p.scaleOn} onChange={(e) => upPkg(i, "scaleOn", e.target.value)}>{SCALE_OPTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
              {p.scaleOn !== "fisso" && (
                <div className="is-row">
                  <div><label>{so(p.scaleOn).inclLabel}</label><input type="number" value={p.included} onChange={(e) => upPkg(i, "included", e.target.value)} /></div>
                  <div><label>{so(p.scaleOn).extraLabel}</label><input type="number" value={p.extra} onChange={(e) => upPkg(i, "extra", e.target.value)} /></div>
                </div>
              )}
            </div>
          ))}
          <button className="is-addpkg" onClick={addPkg}><Plus size={16} /> Aggiungi un altro pacchetto</button>
          <div style={{ marginTop: 24 }}>
            <label>Servizi extra (facoltativi)</label>
            {extra.map((e, i) => (
              <div key={i} className="is-row" style={{ gridTemplateColumns: "2fr 1fr auto", marginTop: 8, alignItems: "center" }}>
                <input value={e.label} onChange={(ev) => upExtra(i, "label", ev.target.value)} placeholder="Es. Amplificazione" />
                <input type="number" value={e.price} onChange={(ev) => upExtra(i, "price", ev.target.value)} placeholder="€" />
                <button className="is-pkg-del" style={{ position: "static" }} onClick={() => delExtra(i)}><Trash2 size={16} /></button>
              </div>
            ))}
            <button className="is-addpkg" onClick={addExtra}><Plus size={16} /> Aggiungi extra</button>
          </div>
          {errore && <div className="is-err">{errore}</div>}
          <div className="is-nav">
            <button className="is-btn" onClick={indietro}><ArrowLeft size={16} /> Indietro</button>
            <button className="is-btn primary" onClick={avanti}>Continua <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="is-card">
          <div className="is-eyebrow">Passo 4 di 5 · Le tue foto</div>
          <h1 className="is-t is-display">Mostra il tuo lavoro</h1>
          <p className="is-sub">Le foto sono la prima cosa che guarda un cliente. Caricane almeno una (fino a 6).</p>

          <div className="is-gal">
            {foto.map((f, i) => (
              <div key={i} className="is-foto">
                <img src={f.url} alt={`Foto ${i + 1}`} />
                <button onClick={() => rimuoviFoto(i)} aria-label="Rimuovi foto"><X size={14} /></button>
                {i === 0 && <span className="is-cover">Copertina</span>}
              </div>
            ))}
            {foto.length < 6 && (
              <label className="is-add">
                {caricando ? <Loader2 size={22} className="is-spin" /> : <ImagePlus size={22} />}
                {caricando ? "Carico…" : "Aggiungi foto"}
                <input type="file" accept="image/*" multiple onChange={caricaFoto}
                       style={{ display: "none" }} disabled={caricando} />
              </label>
            )}
          </div>
          <p className="is-hint">
            La prima foto sarà la copertina del tuo profilo. Massimo 5 MB per immagine (JPG, PNG o WEBP).
          </p>

          <label style={{ marginTop: 20 }}><Video size={13} style={{ verticalAlign: "-2px" }} /> Link a un video (facoltativo)</label>
          <input value={videoLink} onChange={(e) => setVideoLink(e.target.value)}
                 placeholder="https://youtube.com/... oppure un post Instagram" />
          <p className="is-hint">Un video vale più di mille parole: incolla il link di YouTube, Vimeo o Instagram.</p>

          {errore && <div className="is-err">{errore}</div>}
          <div className="is-nav">
            <button className="is-btn" onClick={indietro}><ArrowLeft size={16} /> Indietro</button>
            <button className="is-btn primary" onClick={avanti} disabled={caricando}>Continua <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="is-card">
          <div className="is-eyebrow">Passo 5 di 5 · Tariffe di zona</div>
          <h1 className="is-t is-display">Fin dove ti sposti?</h1>
          <p className="is-sub">
            Indica quanto aggiungi al prezzo in base alla distanza. Il cliente vedrà solo il totale, mai i chilometri.
          </p>

          {fasce.map((f, i) => (
            <div key={i} className="is-fascia" style={{ gridTemplateColumns: "1fr 1fr auto", alignItems: "end" }}>
              <div>
                <label>{i === 0 ? "Entro (km)" : "Poi fino a (km)"}</label>
                <input type="number" value={f.fino} onChange={(e) => upFascia(i, "fino", e.target.value)}
                       placeholder={i === 0 ? "Es. 30" : "Es. 100"} />
              </div>
              <div>
                <label>Costo aggiuntivo (€)</label>
                <input type="number" value={f.fee} onChange={(e) => upFascia(i, "fee", e.target.value)}
                       placeholder={i === 0 ? "0" : "Es. 100"} />
              </div>
              {fasce.length > 1 && (
                <button type="button" className="is-pkg-del" style={{ position: "static", paddingBottom: 12 }}
                        onClick={() => delFascia(i)} title="Rimuovi"><Trash2 size={16} /></button>
              )}
            </div>
          ))}
          <button className="is-addpkg" onClick={addFascia}><Plus size={16} /> Aggiungi una fascia</button>
          <p className="is-hint">
            Esempio: entro 30 km nessun costo, entro 100 km +100 €, entro 250 km +300 €.
          </p>

          <label style={{ marginTop: 22 }}>Non mi sposto oltre (km) *</label>
          <input type="number" value={raggio} onChange={(e) => setRaggio(e.target.value)} placeholder="Es. 150" />
          <p className="is-hint">
            Oltre questa distanza non comparirai nelle ricerche: eviti richieste per eventi troppo lontani.
          </p>

          {errore && <div className="is-err">{errore}</div>}
          <div className="is-nav">
            <button className="is-btn" onClick={indietro}><ArrowLeft size={16} /> Indietro</button>
            <button className="is-btn primary" onClick={invia} disabled={saving}>
              {saving ? <><Loader2 size={16} className="is-spin" /> Invio…</> : <>Invia profilo <Check size={16} /></>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ============ ROUTER INTERNO ============ */
export default function Iscrizione() {
  const [stato, setStato] = useState("check"); // check | crea | completa | giafatto
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setStato("crea"); return; }
      setUser(session.user);
      // ha già un profilo completo? (nome valorizzato = già compilato)
      const { data: forn } = await supabase
        .from("fornitori").select("nome, ruolo, pacchetti(id)")
        .eq("user_id", session.user.id).maybeSingle();
      const completo = forn && forn.nome && forn.nome !== "Nuovo professionista"
        && forn.ruolo && forn.pacchetti?.length > 0;
      setStato(completo ? "giafatto" : "completa");
    })();
  }, []);

  return (
    <div className="is-root"><Style /><Header />
      <div className="is-wrap">
        {stato === "check" && <div style={{ textAlign: "center", padding: "70px 0", color: "var(--grigio)" }}><Loader2 size={26} className="is-spin" /></div>}
        {stato === "crea" && <CreaAccount />}
        {stato === "completa" && user && <CompletaProfilo user={user} />}
        {stato === "giafatto" && (
          <div className="is-card is-ok">
            <Check size={40} style={{ color: "var(--accent)", marginBottom: 12 }} />
            <h1 className="is-t is-display">Profilo già inviato ✓</h1>
            <p className="is-sub">Il tuo profilo è in verifica o già online. Gestiscilo dal tuo account.</p>
            <a href="/?accedi" className="is-btn primary" style={{ marginTop: 18, display: "inline-flex" }}>Vai al mio account</a>
          </div>
        )}
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "var(--grigio)", padding: "10px 0 40px" }}>
        Il team Click Eventi verifica ogni profilo prima della pubblicazione.<br />Iscrivendoti accetti l'<a href="/?privacy" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>informativa privacy</a>.
      </p>
    </div>
  );
}
