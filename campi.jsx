import { useState } from "react";
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
