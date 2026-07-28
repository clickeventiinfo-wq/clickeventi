import { useState } from "react";
import {
  Music, Camera, Martini, PartyPopper, Sparkles,
  Check, ArrowLeft, ArrowRight, Plus, Trash2, PartyPopper as Party, Loader2
} from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — Iscrizione professionista
   Modulo unico a step: dati + account, pacchetti, tariffe di zona.
   Alla fine crea l'account (Supabase Auth) e salva il profilo
   completo in stato "in attesa" per l'approvazione di Susanna.
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

const pacchettoVuoto = () => ({
  label: "", event: "Ogni evento", base: "", includes: "",
  scaleOn: "fisso", included: "", extra: "",
});

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg:#fff;--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2;}
    *{box-sizing:border-box;margin:0;padding:0}
    .is-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .is-display{font-family:'Sora',sans-serif}
    .is-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .is-wrap{max-width:640px;margin:0 auto;padding:0 20px}
    .is-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;cursor:pointer}
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
    .is-btn{display:inline-flex;align-items:center;gap:8px;border-radius:11px;font:600 15px 'Work Sans';padding:12px 22px;cursor:pointer;border:1px solid var(--linea);background:#fff;color:var(--ink)}
    .is-btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
    .is-btn.primary:hover{background:#7A5CE8}
    .is-btn:disabled{opacity:.5;cursor:default}
    .is-err{color:#C0392B;font-size:13px;margin-top:12px;font-weight:600}
    .is-hint{font-size:12px;color:var(--grigio);margin-top:6px}
    .is-ok{text-align:center;padding:40px 20px}
    .is-ok svg{color:var(--accent);margin-bottom:14px}
    .is-newcat{margin-top:8px}
    .is-spin{animation:is-rot 1s linear infinite}@keyframes is-rot{to{transform:rotate(360deg)}}
    @media(max-width:560px){.is-cats{grid-template-columns:repeat(2,1fr)}.is-row{grid-template-columns:1fr}}
  `}</style>
);

export default function Iscrizione() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");
  const [fatto, setFatto] = useState(false);

  // step 1 — chi sei + account
  const [d, setD] = useState({
    nome: "", ruolo: "", categoria: "", nuovaCat: "",
    localita: "", telefono: "", email: "", password: "",
  });
  // step 2 — pacchetti + extra
  const [pacchetti, setPacchetti] = useState([pacchettoVuoto()]);
  const [extra, setExtra] = useState([]);
  // step 3 — fasce km
  const [fasce, setFasce] = useState([
    { fino: 30, fee: 0 }, { fino: 100, fee: "" }, { fino: 99999, fee: "" },
  ]);

  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });

  const validStep1 = () => {
    if (!d.nome || !d.ruolo || !d.localita || !d.email || !d.password) return "Compila tutti i campi obbligatori.";
    if (!d.categoria) return "Scegli una categoria.";
    if (d.categoria === "altro" && !d.nuovaCat) return "Scrivi il nome della categoria che proponi.";
    if (d.password.length < 6) return "La password deve avere almeno 6 caratteri.";
    if (!d.email.includes("@")) return "Inserisci un'email valida.";
    return "";
  };
  const validStep2 = () => {
    const p = pacchetti[0];
    if (!p.label || !p.base) return "Inserisci almeno un pacchetto con nome e prezzo.";
    return "";
  };

  const avanti = () => {
    const err = step === 1 ? validStep1() : step === 2 ? validStep2() : "";
    if (err) { setErrore(err); return; }
    setErrore(""); setStep(step + 1);
  };
  const indietro = () => { setErrore(""); setStep(step - 1); };

  const addPkg = () => setPacchetti([...pacchetti, pacchettoVuoto()]);
  const delPkg = (i) => setPacchetti(pacchetti.filter((_, x) => x !== i));
  const upPkg = (i, k, v) => setPacchetti(pacchetti.map((p, x) => x === i ? { ...p, [k]: v } : p));

  const addExtra = () => setExtra([...extra, { label: "", price: "" }]);
  const delExtra = (i) => setExtra(extra.filter((_, x) => x !== i));
  const upExtra = (i, k, v) => setExtra(extra.map((e, x) => x === i ? { ...e, [k]: v } : e));

  const upFascia = (i, v) => setFasce(fasce.map((f, x) => x === i ? { ...f, fee: v } : f));

  const invia = async () => {
    setErrore(""); setSaving(true);
    const categoriaFinale = d.categoria === "altro" ? "musica" : d.categoria; // la proposta va in nota
    // 1) crea account con i metadati del profilo
    const { data: signUp, error: errAuth } = await supabase.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        data: {
          nome: d.nome, ruolo: d.ruolo, categoria: categoriaFinale, localita: d.localita,
        },
        emailRedirectTo: "https://clickeventi.it/?pannello",
      },
    });
    if (errAuth) {
      setSaving(false);
      setErrore(errAuth.message.includes("registered") ? "Questa email è già registrata. Prova ad accedere." : "Errore nella creazione dell'account: " + errAuth.message);
      return;
    }

    // 2) il trigger ha creato la riga fornitore; la recuperiamo e la completiamo
    const uid = signUp.user?.id;
    // aspetta un attimo che il trigger scriva
    await new Promise((r) => setTimeout(r, 800));
    const { data: forn } = await supabase.from("fornitori").select("id").eq("user_id", uid).maybeSingle();

    if (forn?.id) {
      const fid = forn.id;
      await supabase.from("fornitori").update({
        telefono: d.telefono,
        email: d.email,
        bio: d.categoria === "altro" ? ("Categoria proposta dal fornitore: " + d.nuovaCat) : null,
      }).eq("id", fid);

      // pacchetti
      const pkgRows = pacchetti.filter((p) => p.label && p.base).map((p) => ({
        fornitore_id: fid, label: p.label, evento: p.event, base: Number(p.base) || 0,
        includes: p.includes, scale_on: p.scaleOn,
        inclusi: Number(p.included) || 0, extra_unita: Number(p.extra) || 0,
      }));
      if (pkgRows.length) await supabase.from("pacchetti").insert(pkgRows);

      // extra
      const exRows = extra.filter((e) => e.label && e.price).map((e) => ({
        fornitore_id: fid, label: e.label, prezzo: Number(e.price) || 0,
      }));
      if (exRows.length) await supabase.from("extra").insert(exRows);

      // fasce
      const faRows = fasce.map((f) => ({
        fornitore_id: fid, fino_a_km: Number(f.fino), fee: Number(f.fee) || 0,
      }));
      await supabase.from("fasce").insert(faRows);
    }

    setSaving(false);
    setFatto(true);
  };

  if (fatto) {
    return (
      <div className="is-root"><Style />
        <header className="is-head"><div className="is-wrap"><span className="is-logo">Click<em>Eventi</em></span></div></header>
        <div className="is-wrap"><div className="is-card is-ok">
          <Party size={44} />
          <h1 className="is-t is-display">Ci siamo quasi! 🎉</h1>
          <p className="is-sub" style={{ maxWidth: 420, margin: "8px auto 0" }}>
            Ti abbiamo inviato un'email a <b>{d.email}</b>: clicca il link per confermare l'iscrizione.
            Poi il team Click Eventi verificherà il tuo profilo e lo pubblicherà. Ti avvisiamo appena sei online!
          </p>
        </div></div>
      </div>
    );
  }

  const so = (id) => scaleOpt(id);

  return (
    <div className="is-root"><Style />
      <header className="is-head">
        <div className="is-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" className="is-logo" style={{ textDecoration: "none", color: "inherit" }}>Click<em>Eventi</em></a>
          <a href="/?pannello" style={{ fontSize: 13, fontWeight: 600, color: "var(--grigio)", textDecoration: "none" }}>Hai già un account? Accedi</a>
        </div>
      </header>

      <div className="is-wrap">
        <div className="is-steps">
          {[1, 2, 3].map((n) => <div key={n} className={"is-stepdot" + (step >= n ? " on" : "")} />)}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="is-card">
            <div className="is-eyebrow">Passo 1 di 3</div>
            <h1 className="is-t is-display">Diventa un professionista</h1>
            <p className="is-sub">Raccontaci chi sei. Questi dati appariranno sul tuo profilo.</p>

            <label>Nome o nome d'arte *</label>
            <input value={d.nome} onChange={set("nome")} placeholder="Es. Elisa Quaranta" />

            <label>Cosa fai *</label>
            <input value={d.ruolo} onChange={set("ruolo")} placeholder="Es. Violinista, DJ, Fotografo…" />

            <label>Categoria *</label>
            <div className="is-cats">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className={"is-cat" + (d.categoria === c.id ? " on" : "")}
                       onClick={() => setD({ ...d, categoria: c.id })}>
                    <Icon size={20} strokeWidth={1.9} />{c.label}
                  </div>
                );
              })}
            </div>
            <div className={"is-cat is-newcat" + (d.categoria === "altro" ? " on" : "")}
                 style={{ display: "inline-block", padding: "8px 14px", marginTop: 8 }}
                 onClick={() => setD({ ...d, categoria: "altro" })}>
              + Proponi una nuova categoria
            </div>
            {d.categoria === "altro" && (
              <input style={{ marginTop: 8 }} value={d.nuovaCat} onChange={set("nuovaCat")}
                     placeholder="Es. Scenografie, Noleggio auto…" />
            )}

            <div className="is-row">
              <div><label>Città *</label><input value={d.localita} onChange={set("localita")} placeholder="Es. Lecce" /></div>
              <div><label>Telefono</label><input value={d.telefono} onChange={set("telefono")} placeholder="Per i clienti" /></div>
            </div>

            <label>Email *</label>
            <input type="email" value={d.email} onChange={set("email")} placeholder="La userai per accedere" />
            <label>Password *</label>
            <input type="password" value={d.password} onChange={set("password")} placeholder="Almeno 6 caratteri" />

            {errore && <div className="is-err">{errore}</div>}
            <div className="is-nav">
              <a href="/" className="is-btn">Annulla</a>
              <button className="is-btn primary" onClick={avanti}>Continua <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="is-card">
            <div className="is-eyebrow">Passo 2 di 3</div>
            <h1 className="is-t is-display">I tuoi pacchetti</h1>
            <p className="is-sub">Crea almeno un pacchetto. Potrai aggiungerne o modificarli quando vuoi.</p>

            {pacchetti.map((p, i) => (
              <div key={i} className="is-pkg">
                {pacchetti.length > 1 && (
                  <button className="is-pkg-del" onClick={() => delPkg(i)} aria-label="Elimina"><Trash2 size={16} /></button>
                )}
                <label>Nome del pacchetto *</label>
                <input value={p.label} onChange={(e) => upPkg(i, "label", e.target.value)} placeholder='Es. "Set acustico", "Open bar festa"' />
                <div className="is-row">
                  <div>
                    <label>Per quale evento</label>
                    <select value={p.event} onChange={(e) => upPkg(i, "event", e.target.value)}>
                      {EVENT_OPTS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Prezzo base (€) *</label>
                    <input type="number" value={p.base} onChange={(e) => upPkg(i, "base", e.target.value)} />
                  </div>
                </div>
                <label>Cosa include</label>
                <input value={p.includes} onChange={(e) => upPkg(i, "includes", e.target.value)} placeholder="Es. 1 ora di esibizione · Impianto incluso" />
                <label>Come scala il prezzo</label>
                <select value={p.scaleOn} onChange={(e) => upPkg(i, "scaleOn", e.target.value)}>
                  {SCALE_OPTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
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
              <p className="is-hint">Voci che il cliente può aggiungere a qualsiasi pacchetto.</p>
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

        {/* STEP 3 */}
        {step === 3 && (
          <div className="is-card">
            <div className="is-eyebrow">Passo 3 di 3</div>
            <h1 className="is-t is-display">Le tue tariffe di zona</h1>
            <p className="is-sub">Quanto aggiungi al prezzo in base alla distanza dell'evento. Il cliente vedrà solo il totale, mai i km.</p>

            <div className="is-fascia">
              <div><label>Entro 30 km</label><input value="Incluso" disabled /></div>
              <div><label>Costo aggiuntivo</label><input value="0 €" disabled /></div>
            </div>
            <div className="is-fascia">
              <div><label>Entro 100 km</label><input value="Fascia media" disabled /></div>
              <div><label>Costo aggiuntivo (€)</label><input type="number" value={fasce[1].fee} onChange={(e) => upFascia(1, e.target.value)} placeholder="Es. 100" /></div>
            </div>
            <div className="is-fascia">
              <div><label>Oltre 100 km</label><input value="Fascia lontana" disabled /></div>
              <div><label>Costo aggiuntivo (€)</label><input type="number" value={fasce[2].fee} onChange={(e) => upFascia(2, e.target.value)} placeholder="Es. 150" /></div>
            </div>
            <p className="is-hint">Non sai che valori mettere? Lascia pure vuoto: potrai impostarli dopo con l'aiuto del team.</p>

            {errore && <div className="is-err">{errore}</div>}
            <div className="is-nav">
              <button className="is-btn" onClick={indietro}><ArrowLeft size={16} /> Indietro</button>
              <button className="is-btn primary" onClick={invia} disabled={saving}>
                {saving ? <><Loader2 size={16} className="is-spin" /> Invio…</> : <>Invia iscrizione <Check size={16} /></>}
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--grigio)", padding: "10px 0 40px" }}>
          Iscrivendoti accetti che il team Click Eventi verifichi il tuo profilo prima della pubblicazione.
        </p>
      </div>
    </div>
  );
}
