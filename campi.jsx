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
