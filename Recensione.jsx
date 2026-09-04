import { useState, useEffect } from "react";
import { Star, Check, Loader2, PartyPopper } from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — Pagina recensione
   Si apre dal link inviato al cliente dopo l'evento:
   clickeventi.it/?recensione=TOKEN
   Conferma che l'evento si è svolto e raccoglie il voto.
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--accent-soft:#F3EFFE;--grigio:#6E6A80;--linea:#ECE9E2;--ambra:#F0A32B}
    *{box-sizing:border-box;margin:0;padding:0}
    .rc-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .rc-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .rc-wrap{max-width:520px;margin:0 auto;padding:0 20px}
    .rc-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .rc-logo em{font-style:normal;color:var(--accent)}
    .rc-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:30px;margin:26px 0}
    .rc-card h1{font-family:'Sora',sans-serif;font-size:23px;line-height:1.3;margin-bottom:8px}
    .rc-sub{color:var(--grigio);font-size:14.5px;line-height:1.6;margin-bottom:20px}
    .rc-forn{display:flex;align-items:center;gap:13px;background:var(--bg2);border-radius:13px;padding:13px;margin-bottom:22px}
    .rc-forn img{width:52px;height:52px;border-radius:12px;object-fit:cover;flex-shrink:0}
    .rc-forn .rc-ini{width:52px;height:52px;border-radius:12px;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;font:700 18px 'Sora',sans-serif;flex-shrink:0}
    .rc-forn b{font-family:'Sora',sans-serif;font-size:16px;display:block}
    .rc-forn small{color:var(--grigio);font-size:13px}
    .rc-stelle{display:flex;gap:6px;justify-content:center;margin:6px 0 8px}
    .rc-stella{background:none;border:none;cursor:pointer;padding:4px;line-height:0;transition:transform .12s}
    .rc-stella:hover{transform:scale(1.12)}
    .rc-voto-txt{text-align:center;font-weight:600;font-size:14.5px;color:var(--grigio);min-height:22px;margin-bottom:16px}
    label{display:block;font-size:13px;font-weight:600;margin:14px 0 6px}
    textarea{width:100%;border:1px solid var(--linea);border-radius:11px;font:500 14.5px 'Work Sans',sans-serif;padding:12px;background:#fff;color:var(--ink);outline-color:var(--accent);resize:vertical}
    .rc-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--accent);color:#fff;border:none;border-radius:12px;font:600 15.5px 'Work Sans',sans-serif;padding:14px;cursor:pointer;margin-top:20px}
    .rc-btn:hover{background:#7A5CE8}
    .rc-btn:disabled{opacity:.55;cursor:default}
    .rc-err{color:#C0392B;font-size:13.5px;margin-top:14px;font-weight:600;text-align:center}
    .rc-nota{font-size:12.5px;color:var(--grigio);margin-top:14px;text-align:center;line-height:1.5}
    .rc-ok{text-align:center;padding:20px 0}
    .rc-ok svg{color:var(--accent);margin-bottom:14px}
    .rc-center{text-align:center;padding:80px 20px;color:var(--grigio)}
    .rc-spin{animation:rc-rot 1s linear infinite}@keyframes rc-rot{to{transform:rotate(360deg)}}
  `}</style>
);

const GIUDIZI = ["", "Deludente", "Poteva andare meglio", "Nella media", "Molto bene", "Perfetto!"];

export default function Recensione({ token }) {
  const [stato, setStato] = useState("check");   // check | form | inviata | errore
  const [dati, setDati] = useState(null);
  const [voto, setVoto] = useState(0);
  const [hover, setHover] = useState(0);
  const [testo, setTesto] = useState("");
  const [errore, setErrore] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) { setStato("errore"); setErrore("Link non valido."); return; }
      const { data, error } = await supabase.rpc("richiesta_da_token", { p_token: token });
      if (error || !data?.ok) {
        setStato("errore");
        setErrore("Questo link non è valido o è scaduto.");
        return;
      }
      setDati(data);
      if (data.gia_recensito) { setStato("inviata"); return; }
      setStato("form");
    })();
  }, [token]);

  const invia = async () => {
    if (!voto) { setErrore("Scegli quante stelle dare."); return; }
    setErrore(""); setSaving(true);
    const { data, error } = await supabase.rpc("lascia_recensione", {
      p_token: token, p_voto: voto, p_testo: testo || null,
    });
    setSaving(false);
    if (error) { setErrore("Non siamo riusciti a salvare la recensione. Riprova."); return; }
    if (!data?.ok) { setErrore(data?.errore || "Qualcosa è andato storto."); return; }
    setStato("inviata");
  };

  const iniziali = (n) => (n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="rc-root"><Style />
      <header className="rc-head">
        <div className="rc-wrap"><a href="/" className="rc-logo">Click<em>Eventi</em></a></div>
      </header>

      <div className="rc-wrap">
        {stato === "check" && (
          <div className="rc-center"><Loader2 size={26} className="rc-spin" /></div>
        )}

        {stato === "errore" && (
          <div className="rc-card" style={{ textAlign: "center" }}>
            <h1>Link non valido</h1>
            <p className="rc-sub">{errore} Se pensi ci sia un errore scrivici a info@clickeventi.it</p>
            <a href="/" className="rc-btn" style={{ textDecoration: "none" }}>Torna al sito</a>
          </div>
        )}

        {stato === "inviata" && (
          <div className="rc-card rc-ok">
            <PartyPopper size={42} />
            <h1>Grazie{dati?.cliente ? `, ${dati.cliente.split(" ")[0]}` : ""}!</h1>
            <p className="rc-sub" style={{ marginTop: 8 }}>
              La tua recensione è online e aiuterà altre persone a scegliere con più fiducia.
            </p>
            <a href="/" className="rc-btn" style={{ textDecoration: "none" }}>Torna al sito</a>
          </div>
        )}

        {stato === "form" && dati && (
          <div className="rc-card">
            <h1>Com'è andata?</h1>
            <p className="rc-sub">
              Raccontaci la tua esperienza: bastano pochi secondi e aiuti chi sta organizzando il suo evento.
            </p>

            <div className="rc-forn">
              {dati.foto
                ? <img src={dati.foto} alt={dati.fornitore} />
                : <div className="rc-ini">{iniziali(dati.fornitore)}</div>}
              <div>
                <b>{dati.fornitore}</b>
                <small>
                  {dati.evento || "Evento"}
                  {dati.data ? ` · ${new Date(dati.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                </small>
              </div>
            </div>

            <div className="rc-stelle">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} className="rc-stella" aria-label={`${n} stelle`}
                        onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                        onClick={() => setVoto(n)}>
                  <Star size={38}
                        fill={(hover || voto) >= n ? "var(--ambra)" : "none"}
                        color={(hover || voto) >= n ? "var(--ambra)" : "#D9D5E0"}
                        strokeWidth={1.6} />
                </button>
              ))}
            </div>
            <div className="rc-voto-txt">{GIUDIZI[hover || voto]}</div>

            <label htmlFor="rc-testo">Vuoi aggiungere due righe? (facoltativo)</label>
            <textarea id="rc-testo" rows={4} value={testo} onChange={(e) => setTesto(e.target.value)}
                      placeholder="Es. puntualissimo, ha capito subito che atmosfera volevamo…" />

            {errore && <div className="rc-err">{errore}</div>}

            <button className="rc-btn" onClick={invia} disabled={saving}>
              {saving ? <><Loader2 size={17} className="rc-spin" /> Invio…</> : <><Check size={17} /> Pubblica la recensione</>}
            </button>
            <p className="rc-nota">
              Inviando confermi che l'evento si è svolto. La recensione comparirà sul profilo
              del professionista con il tuo nome di battesimo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
