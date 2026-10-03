import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

/* ============================================================
   Campo password con l'"occhietto" per mostrare quello che si scrive.
   Usa lo stile del modulo in cui viene inserito.
   ============================================================ */
export function PasswordInput({ id, value, onChange, placeholder, className, onKeyDown, autoComplete }) {
  const [visibile, setVisibile] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={visibile ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete={autoComplete}
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={() => setVisibile(!visibile)}
        aria-label={visibile ? "Nascondi la password" : "Mostra la password"}
        title={visibile ? "Nascondi" : "Mostra"}
        style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", padding: 6,
          color: "#6E6A80", display: "flex", alignItems: "center", lineHeight: 0,
        }}
      >
        {visibile ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

/* ============================================================
   Tendina con lo stile del sito.
   Le tendine di sistema non si possono personalizzare: questa le
   sostituisce mantenendo tastiera e accessibilità.
   ============================================================ */
export function Tendina({ valore, onChange, opzioni, etichetta, className, style }) {
  const [aperta, setAperta] = useState(false);
  const [evidenziata, setEvidenziata] = useState(-1);
  const box = useRef(null);

  const scelta = opzioni.find((o) => o.id === valore) || opzioni[0];

  useEffect(() => {
    if (!aperta) return;
    const fuori = (e) => { if (box.current && !box.current.contains(e.target)) setAperta(false); };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [aperta]);

  const tasti = (e) => {
    if (!aperta && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault(); setAperta(true);
      setEvidenziata(opzioni.findIndex((o) => o.id === valore));
      return;
    }
    if (!aperta) return;
    if (e.key === "Escape") { setAperta(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setEvidenziata((i) => Math.min(i + 1, opzioni.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setEvidenziata((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && evidenziata >= 0) {
      e.preventDefault(); onChange(opzioni[evidenziata].id); setAperta(false);
    }
  };

  return (
    <div ref={box} style={{ position: "relative", ...style }}>
      <button
        type="button"
        className={className}
        aria-haspopup="listbox"
        aria-expanded={aperta}
        aria-label={etichetta}
        onClick={() => { setAperta(!aperta); setEvidenziata(opzioni.findIndex((o) => o.id === valore)); }}
        onKeyDown={tasti}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 8, cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {scelta?.label}
        </span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
             style={{ flexShrink: 0, opacity: .55, transition: "transform .18s",
                      transform: aperta ? "rotate(180deg)" : "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {aperta && (
        <div role="listbox" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 80,
          background: "#fff", border: "1px solid #ECE9E2", borderRadius: 13,
          boxShadow: "0 14px 38px rgba(35,32,58,.14)", overflow: "hidden",
          maxHeight: 280, overflowY: "auto", padding: 5,
        }}>
          {opzioni.map((o, i) => {
            const attiva = o.id === valore;
            const sopra = i === evidenziata;
            return (
              <div
                key={o.id ?? i}
                role="option"
                aria-selected={attiva}
                onMouseEnter={() => setEvidenziata(i)}
                onMouseDown={() => { onChange(o.id); setAperta(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  padding: "10px 13px", borderRadius: 9, cursor: "pointer",
                  font: (attiva ? 600 : 500) + " 14px 'Work Sans', sans-serif",
                  color: attiva ? "#8B6EF3" : "#23203A",
                  background: sopra ? (attiva ? "#F3EFFE" : "#FAF9F7") : attiva ? "#F3EFFE" : "transparent",
                }}
              >
                {o.label}
                {attiva && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Calendario con lo stile del sito.
   Sostituisce il selettore di data del browser, che ogni
   sistema disegna a modo suo.
   Il valore scambiato è una stringa "AAAA-MM-GG".
   ============================================================ */
const MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
  "luglio","agosto","settembre","ottobre","novembre","dicembre"];
const GIORNI_SIGLA = ["L","M","M","G","V","S","D"];

const aStringa = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function CalendarioInput({
  valore, onChange, placeholder = "Scegli una data",
  etichetta = "Data", className, soloFuturo = true, style,
}) {
  const scelta = valore ? new Date(valore + "T12:00:00") : null;
  const oggi = new Date(); oggi.setHours(12, 0, 0, 0);

  const [aperto, setAperto] = useState(false);
  const [mese, setMese] = useState(scelta ? scelta.getMonth() : oggi.getMonth());
  const [anno, setAnno] = useState(scelta ? scelta.getFullYear() : oggi.getFullYear());
  const box = useRef(null);

  useEffect(() => {
    if (!aperto) return;
    const fuori = (e) => { if (box.current && !box.current.contains(e.target)) setAperto(false); };
    const esc = (e) => { if (e.key === "Escape") setAperto(false); };
    document.addEventListener("mousedown", fuori);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", fuori); document.removeEventListener("keydown", esc); };
  }, [aperto]);

  /* griglia del mese: la settimana inizia di lunedì */
  const primo = new Date(anno, mese, 1);
  const spostamento = (primo.getDay() + 6) % 7;
  const quanti = new Date(anno, mese + 1, 0).getDate();
  const celle = [...Array(spostamento).fill(null), ...Array.from({ length: quanti }, (_, i) => i + 1)];

  const cambiaMese = (d) => {
    const m = mese + d;
    if (m < 0) { setMese(11); setAnno(anno - 1); }
    else if (m > 11) { setMese(0); setAnno(anno + 1); }
    else setMese(m);
  };

  const testo = scelta
    ? scelta.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : placeholder;

  return (
    <div ref={box} style={{ position: "relative", ...style }}>
      <button type="button" className={className} aria-label={etichetta} aria-expanded={aperto}
              onClick={() => setAperto(!aperto)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                       gap: 8, cursor: "pointer", textAlign: "left" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                       color: scelta ? "inherit" : "#B9B5C6", fontWeight: scelta ? "inherit" : 500 }}>
          {testo}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: .5 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {aperto && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 90, width: 282,
          background: "#fff", border: "1px solid #ECE9E2", borderRadius: 15,
          boxShadow: "0 14px 38px rgba(35,32,58,.15)", padding: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button type="button" onClick={() => cambiaMese(-1)} aria-label="Mese precedente"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6,
                             borderRadius: 8, color: "#6E6A80", lineHeight: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <b style={{ font: "700 14.5px 'Sora', sans-serif", color: "#23203A" }}>
              {MESI[mese]} {anno}
            </b>
            <button type="button" onClick={() => cambiaMese(1)} aria-label="Mese successivo"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6,
                             borderRadius: 8, color: "#6E6A80", lineHeight: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
            {GIORNI_SIGLA.map((g, i) => (
              <div key={i} style={{ textAlign: "center", font: "700 10.5px 'Work Sans', sans-serif",
                                    color: "#9A96A8", letterSpacing: ".04em", padding: "2px 0" }}>{g}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {celle.map((n, i) => {
              if (!n) return <div key={"v" + i} />;
              const data = new Date(anno, mese, n, 12);
              const str = aStringa(data);
              const passata = soloFuturo && data < oggi;
              const attiva = valore === str;
              const eOggi = aStringa(oggi) === str;
              return (
                <button key={n} type="button" disabled={passata}
                        onClick={() => { onChange(str); setAperto(false); }}
                        style={{
                          aspectRatio: "1", border: "none", borderRadius: 9,
                          cursor: passata ? "default" : "pointer",
                          font: (attiva ? 700 : 500) + " 13.5px 'Work Sans', sans-serif",
                          background: attiva ? "#8B6EF3" : "transparent",
                          color: attiva ? "#fff" : passata ? "#D4D1DC" : "#23203A",
                          outline: eOggi && !attiva ? "1.5px solid #DDD3FB" : "none",
                          outlineOffset: -2,
                        }}
                        onMouseEnter={(e) => { if (!passata && !attiva) e.currentTarget.style.background = "#FAF9F7"; }}
                        onMouseLeave={(e) => { if (!attiva) e.currentTarget.style.background = "transparent"; }}>
                  {n}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, borderTop: "1px solid #ECE9E2", paddingTop: 11 }}>
            <button type="button" onClick={() => { onChange(aStringa(oggi)); setAperto(false); }}
                    style={{ flex: 1, background: "#FAF9F7", border: "none", borderRadius: 9, padding: "9px",
                             cursor: "pointer", font: "600 13px 'Work Sans', sans-serif", color: "#23203A" }}>
              Oggi
            </button>
            {valore && (
              <button type="button" onClick={() => { onChange(""); setAperto(false); }}
                      style={{ flex: 1, background: "#fff", border: "1px solid #ECE9E2", borderRadius: 9,
                               padding: "9px", cursor: "pointer", font: "600 13px 'Work Sans', sans-serif",
                               color: "#6E6A80" }}>
                Togli data
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
