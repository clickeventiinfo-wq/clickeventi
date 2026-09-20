import { useState, useEffect } from "react";
import { Check, Loader2, KeyRound } from "lucide-react";
import { supabase } from "./supabase";
import { PasswordInput } from "./campi.jsx";

/* ============================================================
   CLICK EVENTI — Reimposta password
   Si apre dal link ricevuto via email: clickeventi.it/?reimposta
   Il link porta con sé una sessione temporanea che permette
   di impostare una nuova password.
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .rp-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
    .rp-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .rp-wrap{max-width:440px;margin:0 auto;padding:0 20px;width:100%}
    .rp-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .rp-logo em{font-style:normal;color:var(--accent)}
    .rp-main{flex:1;display:flex;align-items:center;padding:40px 0}
    .rp-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:30px;width:100%}
    .rp-icon{width:50px;height:50px;border-radius:14px;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
    h1.rp-t{font-family:'Sora',sans-serif;font-size:23px;font-weight:700;margin-bottom:8px}
    .rp-sub{color:var(--grigio);font-size:14.5px;line-height:1.6;margin-bottom:18px}
    label{display:block;font-size:13px;font-weight:600;margin:14px 0 6px}
    input{width:100%;border:1px solid var(--linea);border-radius:10px;font:500 14px 'Work Sans',sans-serif;padding:11px 12px;background:#fff;color:var(--ink);outline-color:var(--accent)}
    .rp-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--accent);color:#fff;border:none;border-radius:12px;font:600 15px 'Work Sans',sans-serif;padding:13px;cursor:pointer;margin-top:20px;text-decoration:none}
    .rp-btn:hover{background:#7A5CE8}
    .rp-btn:disabled{opacity:.6;cursor:default}
    .rp-err{color:#C0392B;font-size:13px;margin-top:14px;font-weight:600}
    .rp-ok-txt{color:#1E9E6A;font-size:12.5px;font-weight:600;margin-top:5px}
    .rp-no-txt{color:#C0392B;font-size:12.5px;font-weight:600;margin-top:5px}
    .rp-center{text-align:center;padding:70px 20px;color:var(--grigio)}
    .rp-spin{animation:rp-rot 1s linear infinite}@keyframes rp-rot{to{transform:rotate(360deg)}}
  `}</style>
);

export default function Reimposta() {
  const [stato, setStato] = useState("check");   // check | form | fatto | scaduto
  const [password, setPassword] = useState("");
  const [conferma, setConferma] = useState("");
  const [errore, setErrore] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    /* il link di recupero porta con sé una sessione temporanea:
       aspettiamo che venga riconosciuta */
    let fatto = false;
    const { data: sub } = supabase.auth.onAuthStateChange((evento, sessione) => {
      if (sessione) { fatto = true; setStato("form"); }
    });
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { fatto = true; setStato("form"); return; }
      setTimeout(() => { if (!fatto) setStato("scaduto"); }, 2500);
    })();
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const salva = async () => {
    if (password.length < 6) { setErrore("La password deve contenere almeno 6 caratteri."); return; }
    if (password !== conferma) { setErrore("Le password inserite non coincidono."); return; }
    setErrore(""); setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("same") || m.includes("different from the old") || m.includes("reuse"))
        setErrore("La nuova password deve essere diversa dalla precedente.");
      else if (m.includes("weak") || m.includes("short") || m.includes("least"))
        setErrore("La password non soddisfa i requisiti minimi di sicurezza.");
      else if (m.includes("expired") || m.includes("invalid") || m.includes("session"))
        setErrore("Il link di reimpostazione è scaduto. Richiedine uno nuovo dalla pagina di accesso.");
      else if (m.includes("rate") || m.includes("many"))
        setErrore("Troppi tentativi ravvicinati. Riprova tra qualche minuto.");
      else
        setErrore("Non è stato possibile aggiornare la password. Per assistenza scrivi a info@clickeventi.it");
      return;
    }
    setStato("fatto");
  };

  return (
    <div className="rp-root"><Style />
      <header className="rp-head">
        <div className="rp-wrap"><a href="/" className="rp-logo">Click<em>Eventi</em></a></div>
      </header>

      <div className="rp-main">
        <div className="rp-wrap">
          {stato === "check" && (
            <div className="rp-center"><Loader2 size={26} className="rp-spin" /><p style={{ marginTop: 10 }}>Verifico il link…</p></div>
          )}

          {stato === "scaduto" && (
            <div className="rp-card">
              <div className="rp-icon"><KeyRound size={24} /></div>
              <h1 className="rp-t">Link non più valido</h1>
              <p className="rp-sub">
                Il link per la reimpostazione della password è scaduto o è già stato utilizzato.
                È possibile richiederne uno nuovo dalla pagina di accesso.
              </p>
              <a href="/?accedi" className="rp-btn">Torna al login</a>
            </div>
          )}

          {stato === "fatto" && (
            <div className="rp-card" style={{ textAlign: "center" }}>
              <div className="rp-icon" style={{ margin: "0 auto 16px" }}><Check size={24} /></div>
              <h1 className="rp-t">Password aggiornata</h1>
              <p className="rp-sub">La password è stata aggiornata correttamente. Puoi accedere con le nuove credenziali.</p>
              <a href="/?pannello" className="rp-btn">Vai al mio pannello</a>
            </div>
          )}

          {stato === "form" && (
            <div className="rp-card">
              <div className="rp-icon"><KeyRound size={24} /></div>
              <h1 className="rp-t">Scegli una nuova password</h1>
              <p className="rp-sub">Inserisci la nuova password e confermala per proseguire.</p>

              <label>Nuova password</label>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}
                             placeholder="Inserisci una password di almeno 6 caratteri"
                             autoComplete="new-password" />
              <label>Ripeti la password</label>
              <PasswordInput value={conferma} onChange={(e) => setConferma(e.target.value)}
                             placeholder="Reinserisci la password" autoComplete="new-password"
                             onKeyDown={(e) => e.key === "Enter" && salva()} />
              {conferma && conferma !== password && <p className="rp-no-txt">Le password non coincidono</p>}
              {conferma && conferma === password && password.length >= 6 && <p className="rp-ok-txt">✓ Le password coincidono</p>}

              {errore && <div className="rp-err">{errore}</div>}

              <button className="rp-btn" onClick={salva} disabled={saving}>
                {saving ? <><Loader2 size={16} className="rp-spin" /> Salvo…</> : <><Check size={16} /> Salva la nuova password</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
