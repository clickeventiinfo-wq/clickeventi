import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";

/* ============================================================
   COMUNI ITALIANI — elenco condiviso
   Il file public/comuni.json viene scaricato una sola volta,
   alla prima digitazione. Ogni comune porta con sé le coordinate,
   che servono per calcolare le distanze e le fasce di prezzo.
   ============================================================ */

let cache = null;
let promessa = null;

export function caricaComuni() {
  if (cache) return Promise.resolve(cache);
  if (!promessa) {
    promessa = fetch("/comuni.json")
      .then((r) => r.json())
      .then((d) => { cache = d; return d; })
      .catch(() => { cache = []; return []; });
  }
  return promessa;
}

const senzaAccenti = (t) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function cercaComuni(elenco, testo) {
  const t = senzaAccenti((testo || "").trim());
  if (t.length < 2) return [];
  const iniziano = [], contengono = [];
  for (const c of elenco) {
    const n = senzaAccenti(c[0]);
    if (n.startsWith(t)) iniziano.push(c);
    else if (n.includes(t)) contengono.push(c);
    if (iniziano.length >= 8) break;
  }
  return [...iniziano, ...contengono].slice(0, 8)
    .map((c) => ({ name: c[0], area: c[1], lat: c[2], lng: c[3] }));
}

/* Campo con suggerimenti. Restituisce {name, area, lat, lng}.
   `valore` è il nome già salvato (per mostrarlo all'apertura). */
export function ComuneInput({ valore, onChange, placeholder = "Cerca il tuo comune…", id }) {
  const [text, setText] = useState(valore || "");
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [pronto, setPronto] = useState(!!cache);
  const [scelto, setScelto] = useState(!!valore);

  const scrivi = async (v) => {
    setText(v); setOpen(true); setScelto(false);
    onChange(null);                       // finché non sceglie, il comune non è valido
    const elenco = await caricaComuni();
    setPronto(true);
    setMatches(cercaComuni(elenco, v));
  };

  const pick = (c) => {
    onChange(c); setText(c.name); setScelto(true); setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        value={text}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => scrivi(e.target.value)}
        onFocus={() => { caricaComuni(); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
      />
      {open && text.trim().length >= 2 && !scelto && (
        <div style={{
          position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, zIndex: 60,
          background: "#fff", border: "1px solid #ECE9E2", borderRadius: 12,
          boxShadow: "0 10px 30px rgba(35,32,58,.10)", overflow: "hidden",
          maxHeight: 240, overflowY: "auto",
        }}>
          {matches.length > 0 ? matches.map((c, i) => (
            <div key={c.name + c.area + i}
                 onMouseDown={() => pick(c)}
                 style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", fontSize: 14, fontWeight: 500 }}
                 onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF9F7")}
                 onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
              <MapPin size={15} color="#8B6EF3" /> {c.name}
              <small style={{ marginLeft: "auto", color: "#6E6A80" }}>{c.area}</small>
            </div>
          )) : (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "#6E6A80" }}>
              {pronto ? "Nessun comune trovato: controlla come l'hai scritto." : "Carico l'elenco dei comuni…"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


/* Più comuni insieme: il primo è quello principale, gli altri sono
   zone aggiuntive in cui il professionista lavora. */
export function ComuniMultipli({ principale, zone, onChange, id }) {
  const lista = [principale || null, ...(zone || [])];

  const aggiorna = (i, valore) => {
    const nuova = [...lista];
    nuova[i] = valore;
    onChange({ principale: nuova[0], zone: nuova.slice(1).filter(Boolean) });
  };
  const aggiungi = () => onChange({ principale: lista[0], zone: [...(zone || []), null] });
  const togli = (i) => {
    const nuova = lista.filter((_, x) => x !== i);
    onChange({ principale: nuova[0] || null, zone: nuova.slice(1).filter(Boolean) });
  };

  return (
    <div>
      {lista.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i === lista.length - 1 ? 0 : 8 }}>
          <div style={{ flex: 1 }}>
            <ComuneInput
              id={i === 0 ? id : undefined}
              valore={c?.name}
              onChange={(v) => aggiorna(i, v)}
              placeholder={i === 0 ? "Il tuo comune…" : "Altra zona in cui lavori…"}
            />
          </div>
          {i === 0 ? (
            <button type="button" onClick={aggiungi} title="Aggiungi un'altra zona"
                    style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 10, cursor: "pointer",
                             border: "1px solid #ECE9E2", background: "#F3EFFE", color: "#8B6EF3",
                             display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={18} />
            </button>
          ) : (
            <button type="button" onClick={() => togli(i)} title="Rimuovi questa zona"
                    style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 10, cursor: "pointer",
                             border: "1px solid #ECE9E2", background: "#fff", color: "#6E6A80",
                             display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={17} />
            </button>
          )}
        </div>
      ))}
      <p style={{ fontSize: 12, color: "#6E6A80", marginTop: 7 }}>
        Aggiungi altre zone se lavori abitualmente in più aree: i clienti ti troveranno anche lì.
      </p>
    </div>
  );
}
