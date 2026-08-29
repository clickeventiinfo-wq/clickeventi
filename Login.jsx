import { useState, useEffect } from "react";
import { LogIn, Loader2, Check, Clock, LogOut, ArrowRight } from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — Accesso professionisti
   - Login (email + password)
   - Link a registrazione (?iscrizione)
   - Se già loggato: mostra stato profilo (in attesa / approvato)
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .lg-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
    .lg-display{font-family:'Sora',sans-serif}
    .lg-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .lg-wrap{max-width:440px;margin:0 auto;padding:0 20px;width:100%}
    .lg-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .lg-logo em{font-style:normal;color:var(--accent)}
    .lg-main{flex:1;display:flex;align-items:center;padding:40px 0}
    .lg-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:30px;width:100%}
    .lg-eyebrow{font:600 12px 'Work Sans';letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
    h1.lg-t{font-family:'Sora',sans-serif;font-size:24px;font-weight:700;margin-bottom:6px}
    .lg-sub{color:var(--grigio);font-size:14px;margin-bottom:18px}
    label{display:block;font-size:13px;font-weight:600;margin:14px 0 5px}
    input{width:100%;border:1px solid var(--linea);border-radius:10px;font:500 14px 'Work Sans';padding:11px 12px;background:#fff;color:var(--ink);outline-color:var(--accent)}
    .lg-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--accent);color:#fff;border:none;border-radius:11px;font:600 15px 'Work Sans';padding:13px;cursor:pointer;margin-top:20px}
    .lg-btn:hover{background:#7A5CE8}
    .lg-btn:disabled{opacity:.6;cursor:default}
    .lg-err{color:#C0392B;font-size:13px;margin-top:14px;font-weight:600}
    .lg-foot{text-align:center;font-size:14px;color:var(--grigio);margin-top:20px}
    .lg-foot a{color:var(--accent);font-weight:600;text-decoration:none}
    .lg-badge{display:inline-flex;align-items:center;gap:7px;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600;margin:6px 0 14px}
    .lg-badge.attesa{background:#FBF2E2;color:#C77E1F}
    .lg-badge.ok{background:#E7F6EF;color:#1E9E6A}
    .lg-link{background:none;border:none;color:var(--grigio);font:600 13px 'Work Sans';cursor:pointer;text-decoration:underline;margin-top:10px}
    .lg-spin{animation:lg-rot 1s linear infinite}@keyframes lg-rot{to{transform:rotate(360deg)}}
  `}</style>
);

export default function Login() {
  const [checking, setChecking] = useState(true);
  const [utente, setUtente] = useState(null);
  const [profilo, setProfilo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");
  const [info, setInfo] = useState("");

  // all'apertura: c'è già una sessione attiva?
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        window.location.href = "/?pannello";
        return;
      }
      setChecking(false);
    })();
  }, []);

  const accedi = async () => {
    setErrore(""); setInfo(""); setSaving(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSaving(false);
    if (error) {
      if (error.message.toLowerCase().includes("confirm")) {
        setErrore("Devi prima confermare l'email: controlla la tua casella (anche lo spam).");
      } else if (error.message.toLowerCase().includes("invalid")) {
        setErrore("Email o password non corretti.");
      } else {
        setErrore(error.message);
      }
      return;
    }
    setUtente(data.user);
    const { data: prof } = await supabase.from("fornitori").select("nome, stato, verificato").eq("user_id", data.user.id).maybeSingle();
    setProfilo(prof);
    window.location.href = "/?pannello";
  };

  const esci = async () => {
    await supabase.auth.signOut();
    setUtente(null); setProfilo(null); setEmail(""); setPassword("");
  };

  const recuperaPassword = async () => {
    if (!email) { setErrore("Scrivi la tua email qui sopra, poi clicca di nuovo."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://clickeventi.it/?pannello" });
    if (error) setErrore(error.message);
    else setInfo("Ti abbiamo inviato un'email per reimpostare la password.");
  };

  if (checking) {
    return (
      <div className="lg-root"><Style />
        <div className="lg-main"><div className="lg-wrap" style={{ textAlign: "center", color: "var(--grigio)" }}>
          <Loader2 size={26} className="lg-spin" /><p style={{ marginTop: 10 }}>Caricamento…</p>
        </div></div>
      </div>
    );
  }

  return (
    <div className="lg-root"><Style />
      <header className="lg-head">
        <div className="lg-wrap"><a href="/" className="lg-logo">Click<em>Eventi</em></a></div>
      </header>

      <div className="lg-main">
        <div className="lg-wrap">
          {utente ? (
            // ---- già loggato: stato profilo ----
            <div className="lg-card">
              <div className="lg-eyebrow">Area professionisti</div>
              <h1 className="lg-t lg-display">Ciao {profilo?.nome || ""}! 👋</h1>
              {profilo?.stato === "approvato" ? (
                <>
                  <div className="lg-badge ok"><Check size={15} /> Profilo online{profilo?.verificato ? " · Verificato" : ""}</div>
                  <p className="lg-sub">Il tuo profilo è pubblicato su Click Eventi. Presto qui gestirai richieste, calendario e listino.</p>
                </>
              ) : (
                <>
                  <div className="lg-badge attesa"><Clock size={15} /> In attesa di approvazione</div>
                  <p className="lg-sub">Il tuo profilo è stato ricevuto! Il team Click Eventi lo sta verificando: ti avvisiamo appena sarà online.</p>
                </>
              )}
              <button className="lg-btn" style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--linea)" }} onClick={esci}>
                <LogOut size={16} /> Esci
              </button>
            </div>
          ) : (
            // ---- non loggato: form di accesso ----
            <div className="lg-card">
              <div className="lg-eyebrow">Area professionisti</div>
              <h1 className="lg-t lg-display">Accedi</h1>
              <p className="lg-sub">Entra per gestire il tuo profilo, le richieste e il calendario.</p>

              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="La tua email" />
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                     placeholder="La tua password" onKeyDown={(e) => e.key === "Enter" && accedi()} />

              {errore && <div className="lg-err">{errore}</div>}
              {info && <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 12, fontWeight: 600 }}>{info}</div>}

              <button className="lg-btn" onClick={accedi} disabled={saving}>
                {saving ? <><Loader2 size={16} className="lg-spin" /> Accesso…</> : <><LogIn size={16} /> Accedi</>}
              </button>
              <div style={{ textAlign: "center" }}>
                <button className="lg-link" onClick={recuperaPassword}>Password dimenticata?</button>
              </div>

              <div className="lg-foot">
                Non hai ancora un account?<br />
                <a href="/?iscrizione">Registrati come professionista <ArrowRight size={13} style={{ verticalAlign: "-1px" }} /></a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
