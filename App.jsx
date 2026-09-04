import { useState, useRef, useEffect } from "react";
import {
  Music, Camera, Martini, PartyPopper, Sparkles,
  MapPin, Star, ArrowLeft, Search, Check, CalendarDays, Send, Users, Clock, Navigation, Loader2
} from "lucide-react";
import { supabase } from "./supabase";

/* ============================================================
   CLICK EVENTI — v2 (collegato al database)
   I fornitori, i pacchetti, i prezzi e le disponibilità
   arrivano da Supabase. Le richieste dei clienti vengono
   salvate nel database.
   ============================================================ */

const EVENT_TYPES = ["Compleanno", "18esimo", "Festa privata", "Laurea", "Evento aziendale", "Evento pubblico", "Matrimonio"];

const CATEGORIES = [
  { id: "musica", label: "Musica", icon: Music },
  { id: "foto", label: "Foto & Video", icon: Camera },
  { id: "barman", label: "Beverage", icon: Martini },
  { id: "animazione", label: "Animazione", icon: PartyPopper },
  { id: "beauty", label: "Hair & Beauty", icon: Sparkles },
];

/* località con coordinate reali (demo — in produzione: Google Places) */
/* ============================================================
   LOCALITÀ — tutti i comuni italiani con le loro coordinate.
   L'elenco (public/comuni.json) viene scaricato solo quando
   serve, cioè quando si inizia a scrivere nel campo "Dove".
   ============================================================ */

const LOC_DEFAULT = { name: "Roma", area: "RM", lat: 41.8928, lng: 12.4837 };

let comuniCache = null;      // [[nome, sigla, lat, lng], ...] ordinati per popolazione
let comuniPromise = null;

function caricaComuni() {
  if (comuniCache) return Promise.resolve(comuniCache);
  if (!comuniPromise) {
    comuniPromise = fetch("/comuni.json")
      .then((r) => r.json())
      .then((d) => { comuniCache = d; return d; })
      .catch(() => { comuniCache = []; return []; });
  }
  return comuniPromise;
}

/* confronto senza accenti e maiuscole */
const senzaAccenti = (t) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function cercaComuni(elenco, testo) {
  const t = senzaAccenti(testo.trim());
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

function distanceKm(a, b) {
  if (!a || !b) return 0;
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/* ---------- helper ---------- */

const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || "";

/* fasce di prezzo per il filtro dei risultati (sul prezzo già adattato alla zona) */
const FASCE_PREZZO = [
  { id: "300", label: "Fino a 300 €", max: 300 },
  { id: "600", label: "300 – 600 €", min: 300, max: 600 },
  { id: "1000", label: "600 – 1.000 €", min: 600, max: 1000 },
  { id: "oltre", label: "Oltre 1.000 €", min: 1000 },
];

/* trasforma una riga del database nel formato usato dal sito */
function fromDb(r) {
  return {
    id: r.id,
    name: r.nome,
    role: r.ruolo,
    cat: r.categoria,
    city: r.localita,
    lat: r.lat,
    lng: r.lng,
    bio: r.bio,
    rating: r.rating,
    reviews: r.recensioni,
    bookings: r.prenotazioni,
    verificato: r.verificato,
    foto: r.foto || [],
    videoLink: r.video_link,
    eventTypes: r.tipi_evento || [],
    busy: (r.indisponibilita || []).map((d) => d.giorno),
    fasce: [...(r.fasce || [])].sort((a, b) => a.fino_a_km - b.fino_a_km),
    packages: (r.pacchetti || []).map((p) => ({
      id: p.id,
      label: p.label,
      event: p.evento,
      base: p.base,
      includes: (p.includes || "").split(" \u00b7 ").filter(Boolean),
      descrizione: p.descrizione,
      scale: { on: p.scale_on === "fisso" ? null : p.scale_on, included: p.inclusi, extra: p.extra_unita },
    })),
    extras: (r.extra || []).map((e) => ({ id: e.id, label: e.label, price: e.prezzo, descrizione: e.descrizione })),
  };
}

/* disponibilità: confronto sulle date reali del calendario */
function isAvailable(p, date) {
  if (!date) return true;
  return !p.busy.includes(date);
}

/* fascia chilometrica: il prezzo si adatta alla zona, senza mostrare i km */
function feeFor(p, eventLoc) {
  if (!eventLoc || !p.lat) return 0;
  const km = distanceKm({ lat: p.lat, lng: p.lng }, eventLoc);
  const f = p.fasce.find((x) => km <= x.fino_a_km) || p.fasce[p.fasce.length - 1];
  return f ? f.fee : 0;
}

const minPrice = (p, eventLoc) =>
  p.packages.length ? Math.min(...p.packages.map((k) => k.base)) + feeFor(p, eventLoc) : 0;

function defaultPackage(p, eventType) {
  return (
    p.packages.find((k) => k.event === eventType) ||
    p.packages.find((k) => k.event === "Tutti") ||
    p.packages[0]
  );
}

function computeQuote(p, pkg, ore, ospiti, selectedExtras, eventLoc) {
  const rows = [{ label: pkg.label, value: pkg.base }];
  let tot = pkg.base;

  if (pkg.scale.on === "ore" && ore > pkg.scale.included) {
    const n = ore - pkg.scale.included;
    rows.push({ label: `${n} \u00d7 ora aggiuntiva`, value: n * pkg.scale.extra });
    tot += n * pkg.scale.extra;
  }
  if ((pkg.scale.on === "ospiti" || pkg.scale.on === "persone") && ospiti > pkg.scale.included) {
    const n = ospiti - pkg.scale.included;
    const unita = pkg.scale.on === "ospiti" ? "ospite in pi\u00f9" : "persona in pi\u00f9";
    rows.push({ label: `${n} \u00d7 ${unita}`, value: n * pkg.scale.extra });
    tot += n * pkg.scale.extra;
  }
  p.extras.forEach((e) => {
    if (selectedExtras.includes(e.id)) {
      rows.push({ label: e.label, value: e.price });
      tot += e.price;
    }
  });

  const fee = feeFor(p, eventLoc);
  if (fee > 0) {
    rows[0] = { label: rows[0].label, value: rows[0].value + fee };
    tot += fee;
  }
  return { rows, tot };
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');

    :root {
      --bg: #FFFFFF;
      --bg2: #FAF9F7;
      --ink: #23203A;
      --accent: #8B6EF3;
      --accent-soft: #F3EFFE;
      --grigio: #6E6A80;
      --linea: #ECE9E2;
      --ombra: 0 10px 30px rgba(35,32,58,0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    img { max-width: 100%; height: auto; }
    .cv-root {
      font-family: 'Work Sans', system-ui, sans-serif;
      background: var(--bg); color: var(--ink);
      min-height: 100vh; -webkit-font-smoothing: antialiased;
    }
    .cv-display { font-family: 'Sora', 'Work Sans', sans-serif; }
    .cv-container { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
    .cv-card-base { background: var(--bg); border: 1px solid var(--linea); border-radius: 16px; }

    /* header */
    .cv-header { background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--linea); position: sticky; top: 0; z-index: 50; }
    .cv-header-in { display: flex; align-items: center; justify-content: space-between; height: 60px; }
    .cv-logo { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 20px; cursor: pointer; }
    .cv-logo em { font-style: normal; color: var(--accent); }
    .cv-btn {
      font: 600 13.5px 'Work Sans', sans-serif; color: #fff;
      background: var(--accent); border: 1px solid var(--accent); border-radius: 999px;
      padding: 9px 18px; cursor: pointer;
    }
    .cv-btn:hover { background: #7A5CE8; border-color: #7A5CE8; }

    /* hero */
    .cv-hero { text-align: center; padding: 68px 20px 60px; background: linear-gradient(180deg, var(--bg2), var(--bg)); }
    .cv-hero h1 {
      font-family: 'Sora', sans-serif; font-weight: 700;
      font-size: clamp(32px, 5.6vw, 52px); line-height: 1.08; letter-spacing: -0.02em;
      max-width: 640px; margin: 0 auto 14px;
    }
    .cv-hero h1 em { font-style: normal; color: var(--accent); }
    .cv-hero p { color: var(--grigio); font-size: 16px; max-width: 470px; margin: 0 auto 30px; }

    /* ricerca */
    .cv-search {
      display: grid; grid-template-columns: 1.15fr .9fr 1fr .95fr 1fr auto; gap: 0;
      max-width: 1040px; margin: 0 auto; text-align: left;
      background: var(--bg); border: 1px solid var(--linea);
      border-radius: 18px; box-shadow: var(--ombra);
    }
    .cv-field { padding: 10px 16px; border-right: 1px solid var(--linea); position: relative; }
    .cv-flabel {
      display: block; font: 600 11px 'Work Sans', sans-serif;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--grigio);
    }
    .cv-field select, .cv-field input {
      width: 100%; border: none; background: transparent;
      font: 600 14.5px 'Work Sans', sans-serif; color: var(--ink);
      padding: 5px 0 2px; outline: none; cursor: pointer;
    }
    .cv-field input::placeholder { color: #B9B5C6; font-weight: 500; }
    .cv-search-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--accent); color: #fff; border: none;
      border-radius: 0 17px 17px 0;
      font: 600 15px 'Work Sans', sans-serif; padding: 0 26px; cursor: pointer;
    }
    .cv-search-btn:hover { background: #7A5CE8; }

    /* dropdown località (stile mappa) */
    .cv-locdrop {
      position: absolute; top: calc(100% + 6px); left: 0; right: -1px; z-index: 60;
      background: var(--bg); border: 1px solid var(--linea); border-radius: 12px;
      box-shadow: var(--ombra); overflow: hidden; max-height: 240px; overflow-y: auto;
    }
    .cv-locitem {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; cursor: pointer; font-size: 14px; font-weight: 500;
    }
    .cv-locitem:hover { background: var(--bg2); }
    .cv-locitem svg { color: var(--accent); flex-shrink: 0; }
    .cv-locitem small { color: var(--grigio); margin-left: auto; }

    /* sezioni */
    .cv-section { padding: 52px 0; }
    .cv-eyebrow {
      font: 600 12px 'Work Sans', sans-serif; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 8px;
    }
    .cv-h2 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(23px, 3.6vw, 30px); letter-spacing: -0.01em; margin-bottom: 24px; }

    /* categorie */
    .cv-cats { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
    .cv-cat {
      padding: 18px 16px; cursor: pointer; text-align: left;
      transition: border-color .15s ease, box-shadow .15s ease;
    }
    .cv-cat:hover { border-color: var(--ink); box-shadow: var(--ombra); }
    .cv-cat svg { color: var(--accent); margin-bottom: 10px; }
    .cv-cat span { display: block; font-weight: 600; font-size: 14px; line-height: 1.3; }

    /* card fornitore */
    .cv-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .cv-grid > * { min-width: 0; }
    .cv-cover {
      width: 100%; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden;
      margin-bottom: 12px; background: var(--bg2);
    }
    .cv-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .cv-card {
      padding: 20px; cursor: pointer; text-align: left; position: relative;
      transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease;
    }
    .cv-card:hover { border-color: var(--ink); box-shadow: var(--ombra); transform: translateY(-2px); }
    .cv-avatar {
      width: 48px; height: 48px; border-radius: 12px;
      background: var(--accent-soft); color: var(--accent);
      font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
    }
    .cv-card h3 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 17.5px; overflow-wrap: anywhere; }
    .cv-role { color: var(--grigio); font-size: 13.5px; margin: 2px 0 10px; }
    .cv-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 12.5px; color: var(--grigio); }
    .cv-meta .cv-star { color: var(--ink); font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .cv-meta .cv-star svg { color: #F0A32B; }
    .cv-km { font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 4px; }
    .cv-price { margin-top: 12px; font-weight: 700; font-size: 15px; }
    .cv-price small { color: var(--grigio); font-weight: 500; }
    .cv-fit {
      display: inline-block; background: var(--accent-soft); color: var(--accent);
      border-radius: 999px; font: 600 11.5px 'Work Sans', sans-serif;
      padding: 3px 10px; margin-bottom: 10px;
    }
    .cv-bookings { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--grigio); margin-top: 8px; }

    /* toolbar */
    .cv-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
    .cv-select {
      border: 1px solid var(--linea); background: var(--bg);
      font: 600 13.5px 'Work Sans', sans-serif; color: var(--ink);
      border-radius: 10px; padding: 8px 10px; cursor: pointer;
    }
    .cv-back {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; color: var(--grigio);
      font: 600 14px 'Work Sans', sans-serif; cursor: pointer; padding: 6px 0;
    }
    .cv-back:hover { color: var(--ink); }
    .cv-empty { padding: 44px 24px; text-align: center; color: var(--grigio); border-style: dashed; }

    /* profilo */
    .cv-two { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 18px; align-items: start; }
    .cv-panel { padding: 22px; }
    .cv-chip {
      display: inline-block; background: var(--bg2); border: 1px solid var(--linea);
      border-radius: 999px; font-size: 12px; font-weight: 600; padding: 3px 10px; margin: 0 6px 6px 0;
    }
    .cv-list li { list-style: none; display: flex; gap: 8px; align-items: flex-start; font-size: 14px; padding: 5px 0; }
    .cv-list svg { color: var(--accent); flex-shrink: 0; margin-top: 2px; }

    /* pacchetti */
    .cv-pkg {
      display: block; border: 1px solid var(--linea); border-radius: 12px;
      padding: 12px 14px; margin-bottom: 8px; cursor: pointer; background: var(--bg);
      transition: border-color .12s ease;
    }
    .cv-pkg:hover { border-color: var(--ink); }
    .cv-pkg.on { border: 2px solid var(--accent); background: var(--accent-soft); padding: 11px 13px; }
    .cv-pkg b { font-size: 14.5px; display: flex; justify-content: space-between; gap: 8px; }
    .cv-pkg small { color: var(--grigio); font-size: 12.5px; line-height: 1.4; }
    .cv-pkg-event {
      font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em;
      color: var(--accent);
    }

    /* form + preventivo */
    .cv-form label { display: block; font-size: 13px; font-weight: 600; margin: 13px 0 5px; }
    .cv-form input, .cv-form textarea, .cv-form select {
      width: 100%; border: 1px solid var(--linea); border-radius: 10px;
      font: 500 14px 'Work Sans', sans-serif; padding: 10px 12px;
      background: var(--bg); color: var(--ink); outline-color: var(--accent);
    }
    .cv-opt { display: flex; align-items: center; gap: 10px; font-size: 14px; padding: 7px 0; cursor: pointer; }
    .cv-opt input { width: auto; accent-color: var(--accent); }
    .cv-opt .cv-opt-price { margin-left: auto; font-weight: 600; color: var(--grigio); }
    .cv-qrow {
      display: flex; justify-content: space-between; gap: 10px;
      font-size: 13.5px; padding: 6px 0; border-bottom: 1px dashed var(--linea);
    }
    .cv-qrow span:last-child { font-weight: 600; white-space: nowrap; }
    .cv-qtotal { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 0 2px; font-weight: 600; }
    .cv-qtotal b { font-family: 'Sora', sans-serif; font-size: 26px; color: var(--ink); }
    .cv-submit {
      margin-top: 16px; width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--accent); color: #fff; border: none; border-radius: 12px;
      font: 600 15px 'Work Sans', sans-serif; padding: 13px; cursor: pointer;
    }
    .cv-submit:hover { background: #7A5CE8; }
    .cv-note { font-size: 12px; color: var(--grigio); margin-top: 10px; text-align: center; }
    .cv-ok { text-align: center; padding: 26px 10px; }
    .cv-ok svg { color: var(--accent); margin-bottom: 10px; }

    /* come funziona */
    .cv-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .cv-step { padding: 22px; }
    .cv-step .cv-dot {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--accent-soft); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font: 700 14px 'Sora', sans-serif; margin-bottom: 12px;
    }
    .cv-step h4 { font-size: 15.5px; margin-bottom: 6px; font-weight: 600; }
    .cv-step p { font-size: 13.5px; color: var(--grigio); line-height: 1.55; }

    .cv-pro {
      background: var(--ink); border-radius: 20px; padding: 40px 36px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 26px; flex-wrap: wrap; margin: 10px 0 50px;
    }
    .cv-pro h3 { font-family: 'Sora', sans-serif; font-size: 25px; color: #fff; margin-bottom: 8px; line-height: 1.25; }
    .cv-pro p { color: #C9C4DA; font-size: 15px; line-height: 1.6; max-width: 430px; }
    .cv-pro ul { list-style: none; display: flex; gap: 18px; flex-wrap: wrap; margin-top: 14px; }
    .cv-pro li { color: #E4E0F0; font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .cv-pro-btn {
      background: var(--accent); color: #fff; border: none; border-radius: 12px;
      font: 700 16px 'Work Sans', sans-serif; padding: 16px 30px; cursor: pointer;
      white-space: nowrap; text-decoration: none; display: inline-block;
    }
    .cv-pro-btn:hover { background: #7A5CE8; }
    .cv-pro-sub { display: block; font-size: 12.5px; color: #9A96A8; margin-top: 10px; text-align: center; font-weight: 500; }
    @media (max-width: 700px) { .cv-pro { padding: 30px 24px; } .cv-pro h3 { font-size: 21px; } }
    .cv-footer { border-top: 1px solid var(--linea); padding: 28px 0; margin-top: 28px; font-size: 13px; color: var(--grigio); background: var(--bg2); }
    .cv-footer .cv-container { display: flex; justify-content: space-between; gap: 14px; flex-wrap: wrap; }

    @media (max-width: 920px) {
      .cv-cats { grid-template-columns: repeat(3, 1fr); }
      .cv-grid { grid-template-columns: 1fr 1fr; }
      .cv-two { grid-template-columns: 1fr; }
      .cv-search { grid-template-columns: 1fr 1fr; }
      .cv-field { border-right: none; border-bottom: 1px solid var(--linea); }
      .cv-search-btn { grid-column: 1 / -1; border-radius: 0 0 17px 17px; padding: 14px; }
    }
    @media (max-width: 560px) {
      .cv-hero { padding: 48px 16px 48px; }
      .cv-search { grid-template-columns: 1fr; }
      .cv-grid { grid-template-columns: 1fr; }
      .cv-cats { grid-template-columns: repeat(2, 1fr); }
      .cv-steps { grid-template-columns: 1fr; }
    }
    .cv-lb { position: fixed; inset: 0; background: rgba(27,24,44,.88); z-index: 200;
      display: flex; align-items: center; justify-content: center; padding: 24px; cursor: zoom-out; }
    .cv-lb img { max-width: min(880px, 92vw); max-height: 86vh; width: auto; height: auto;
      object-fit: contain; border-radius: 12px; display: block; }
    .cv-lb-x { position: absolute; top: 18px; right: 20px; background: rgba(255,255,255,.15);
      border: none; color: #fff; width: 38px; height: 38px; border-radius: 50%; font-size: 20px;
      cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .cv-spin { animation: cv-rot 1s linear infinite; }
    @keyframes cv-rot { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      .cv-card, .cv-cat { transition: none; }
      .cv-spin { animation: none; }
    }
  `}</style>
);
/* ---------- campo località con suggerimenti (stile Maps) ---------- */
function LocationInput({ value, onChange, compact }) {
  const [text, setText] = useState(value ? value.name : "");
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [pronto, setPronto] = useState(!!comuniCache);

  const scrivi = async (v) => {
    setText(v); setOpen(true);
    const elenco = await caricaComuni();
    setPronto(true);
    setMatches(cercaComuni(elenco, v));
  };

  const pick = (l) => { onChange(l); setText(l.name); setOpen(false); };

  return (
    <div style={{ position: "relative" }}>
      <input
        value={text}
        placeholder="Cerca il tuo comune…"
        onChange={(e) => scrivi(e.target.value)}
        onFocus={() => { caricaComuni(); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="Località dell'evento"
        className={compact ? "cv-select" : undefined}
        style={compact ? { minWidth: 160 } : undefined}
      />
      {open && text.trim().length >= 2 && (
        <div className="cv-locdrop">
          {matches.length > 0 ? (
            matches.map((l, i) => (
              <div key={l.name + l.area + i} className="cv-locitem" onMouseDown={() => pick(l)}>
                <MapPin size={15} /> {l.name} <small>{l.area}</small>
              </div>
            ))
          ) : (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--grigio)" }}>
              {pronto ? "Nessun comune trovato con questo nome." : "Carico l'elenco dei comuni…"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- componenti ---------- */

function Header({ goHome }) {
  return (
    <header className="cv-header">
      <div className="cv-container cv-header-in">
        <div className="cv-logo" onClick={goHome} role="button" tabIndex={0}
             onKeyDown={(e) => e.key === "Enter" && goHome()}>
          Click<em>Eventi</em>
        </div>
        <button className="cv-btn" onClick={() => { window.location.href = "/?accedi"; }}>
          Sei un professionista?
        </button>
      </div>
    </header>
  );
}

function ProviderCard({ p, onOpen, eventType, eventLoc }) {
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const fits = eventType && p.eventTypes.includes(eventType);
  return (
    <div className="cv-card cv-card-base" onClick={() => onOpen(p)} role="button" tabIndex={0}
         onKeyDown={(e) => e.key === "Enter" && onOpen(p)}>
      {fits && <span className="cv-fit">Ideale per {eventType}</span>}
      {p.foto?.length > 0 ? (
        <div className="cv-cover"><img src={p.foto[0]} alt={p.name} loading="lazy" /></div>
      ) : (
        <div className="cv-avatar">{initials}</div>
      )}
      <h3>{p.name}</h3>
      <div className="cv-role">{p.role} · {catLabel(p.cat)}</div>
      <div className="cv-meta">
        <span className="cv-star"><Star size={13} fill="#F0A32B" /> {p.rating}</span>
        <span>({p.reviews})</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={12} /> {p.city}
        </span>
        {p.verificato && <span style={{ color: "var(--accent)", fontWeight: 600 }}>✓ Verificato</span>}
      </div>
      <div className="cv-bookings"><Check size={13} /> {p.bookings} eventi prenotati su Click Eventi</div>
      <div className="cv-price">da {minPrice(p, eventLoc)} € <small>a pacchetto</small></div>
    </div>
  );
}

function Caricamento({ testo = "Caricamento…" }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--grigio)" }}>
      <Loader2 size={26} className="cv-spin" style={{ opacity: .6 }} />
      <p style={{ marginTop: 10, fontSize: 14 }}>{testo}</p>
    </div>
  );
}

/* ---------- home ---------- */

function HomeView({ onSearch, openProvider, providers, loading }) {
  const [loc, setLoc] = useState(null);
  const [date, setDate] = useState("");
  const [etype, setEtype] = useState("Festa privata");
  const [cat, setCat] = useState("");
  const [testo, setTesto] = useState("");
  const featured = [...providers].sort((a, b) => b.bookings - a.bookings).slice(0, 6);
  const doSearch = () => onSearch({ loc: loc || LOC_DEFAULT, date, etype, cat, testo, prezzo: "" });

  /* mostra solo le categorie che hanno almeno un professionista attivo:
     il sito cresce da solo man mano che si aggiungono fornitori */
  const attive = CATEGORIES.filter((c) => providers.some((p) => p.cat === c.id));
  const cats = attive.length ? attive : CATEGORIES;

  return (
    <>
      <section className="cv-hero">
        <h1 className="cv-display">Il tuo evento, <em>in un click</em></h1>
        <p>DJ, fotografi, barman, animatori e make-up artist disponibili per la tua data, vicino a te. Preventivo subito.</p>

        <div className="cv-search">
          <div className="cv-field">
            <span className="cv-flabel">Dove</span>
            <LocationInput value={loc} onChange={setLoc} />
          </div>
          <div className="cv-field">
            <span className="cv-flabel">Quando</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Data dell'evento" />
          </div>
          <div className="cv-field">
            <span className="cv-flabel">Tipo di evento</span>
            <select value={etype} onChange={(e) => setEtype(e.target.value)} aria-label="Tipo di evento">
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="cv-field">
            <span className="cv-flabel">Categoria</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoria">
              <option value="">Tutte</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="cv-field">
            <span className="cv-flabel">Chi cerchi</span>
            <input value={testo} onChange={(e) => setTesto(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && doSearch()}
                   placeholder="Es. arpista, DJ…" aria-label="Tipo di professionista" />
          </div>
          <button className="cv-search-btn" onClick={doSearch}>
            <Search size={17} /> Trova
          </button>
        </div>
        <p className="cv-note" style={{ marginTop: 14 }}>
          Cerca il professionista giusto, sfoglia i suoi pacchetti e ricevi subito un preventivo già formulato.
        </p>
      </section>

      <section className="cv-section" style={{ paddingTop: 12 }}>
        <div className="cv-container">
          <span className="cv-eyebrow">Categorie</span>
          <h2 className="cv-h2 cv-display">Le categorie immancabili per organizzare il tuo evento</h2>
          <div className="cv-cats">
            {cats.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="cv-cat cv-card-base" role="button" tabIndex={0}
                     onClick={() => onSearch({ loc: loc || LOC_DEFAULT, date, etype, cat: c.id, testo: "", prezzo: "" })}
                     onKeyDown={(e) => e.key === "Enter" && onSearch({ loc: loc || LOC_DEFAULT, date, etype, cat: c.id, testo: "", prezzo: "" })}>
                  <Icon size={24} strokeWidth={1.9} />
                  <span>{c.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cv-section" style={{ paddingTop: 0 }}>
        <div className="cv-container">
          <span className="cv-eyebrow">I più prenotati</span>
          <h2 className="cv-h2 cv-display">I professionisti del momento</h2>
          {loading ? <Caricamento testo="Carico i professionisti…" /> : (
            <div className="cv-grid">
              {featured.map((p) => <ProviderCard key={p.id} p={p} onOpen={openProvider} />)}
            </div>
          )}
        </div>
      </section>

      <section className="cv-section" style={{ paddingTop: 0 }}>
        <div className="cv-container">
          <span className="cv-eyebrow">Come funziona</span>
          <h2 className="cv-h2 cv-display">Dalla ricerca all'evento</h2>
          <div className="cv-steps">
            <div className="cv-step cv-card-base">
              <div className="cv-dot">1</div>
              <h4>Cerca per luogo e data</h4>
              <p>Vedi solo i professionisti davvero liberi per il tuo giorno: il calendario lo aggiornano loro.</p>
            </div>
            <div className="cv-step cv-card-base">
              <div className="cv-dot">2</div>
              <h4>Componi il preventivo</h4>
              <p>Scegli il pacchetto per il tuo evento, aggiungi ore, ospiti ed extra: il prezzo si aggiorna in diretta.</p>
            </div>
            <div className="cv-step cv-card-base">
              <div className="cv-dot">3</div>
              <h4>Invia la richiesta</h4>
              <p>Il team Click Eventi la gira al professionista e ti ricontatta appena ha la conferma.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 10 }}>
        <div className="cv-container">
          <div className="cv-pro">
            <div>
              <h3>Lavori nel mondo degli eventi?</h3>
              <p>
                Pubblica i tuoi pacchetti su Click Eventi e ricevi richieste già complete
                di data, luogo e budget. Niente trattative al buio.
              </p>
              <ul>
                <li>✓ Iscrizione gratuita</li>
                <li>✓ Nessuna commissione</li>
                <li>✓ Gestisci tu prezzi e calendario</li>
              </ul>
            </div>
            <div>
              <a href="/?iscrizione" className="cv-pro-btn">Iscriviti gratis</a>
              <span className="cv-pro-sub">Ci vogliono 5 minuti</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- risultati ---------- */

function ResultsView({ q, setQ, openProvider, goHome, providers, loading }) {
  const { loc, date, etype, cat, testo, prezzo } = q;
  const cerca = (testo || "").trim().toLowerCase();
  const fascia = FASCE_PREZZO.find((f) => f.id === prezzo);
  const results = providers
    .filter((p) => (!cat || p.cat === cat) && isAvailable(p, date))
    .filter((p) => !cerca ||
      (p.role || "").toLowerCase().includes(cerca) ||
      (p.name || "").toLowerCase().includes(cerca) ||
      catLabel(p.cat).toLowerCase().includes(cerca))
    .filter((p) => {
      if (!fascia) return true;
      const da = minPrice(p, loc);           // prezzo già adattato alla zona
      if (fascia.min && da < fascia.min) return false;
      if (fascia.max && da > fascia.max) return false;
      return true;
    })
    .sort((a, b) => {
      const fa = a.eventTypes.includes(etype) ? 1 : 0;
      const fb = b.eventTypes.includes(etype) ? 1 : 0;
      if (fb !== fa) return fb - fa;
      const ka = distanceKm({ lat: a.lat, lng: a.lng }, loc);
      const kb = distanceKm({ lat: b.lat, lng: b.lng }, loc);
      if (ka !== kb) return ka - kb;
      return b.rating - a.rating;
    });
  const dateLabel = date
    ? new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const attive = CATEGORIES.filter((c) => providers.some((p) => p.cat === c.id));
  const cats = attive.length ? attive : CATEGORIES;

  return (
    <section className="cv-section">
      <div className="cv-container">
        <button className="cv-back" onClick={goHome}><ArrowLeft size={16} /> Torna alla home</button>
        <h2 className="cv-h2 cv-display" style={{ marginTop: 8, marginBottom: 6 }}>
          {cerca ? `"${testo}"` : cat ? catLabel(cat) : "Professionisti"} per il tuo {etype.toLowerCase()}
        </h2>
        <p style={{ fontSize: 14, color: "var(--grigio)", marginBottom: 20 }}>
          Evento a {loc.name}{date ? ` · disponibili il ${dateLabel}` : " — scegli una data per vedere solo i disponibili"}
        </p>

        <div className="cv-toolbar">
          <LocationInput value={loc} onChange={(l) => setQ({ ...q, loc: l })} compact />
          <input className="cv-select" type="date" value={date}
                 onChange={(e) => setQ({ ...q, date: e.target.value })} aria-label="Data" />
          <select className="cv-select" value={etype} onChange={(e) => setQ({ ...q, etype: e.target.value })} aria-label="Tipo di evento">
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="cv-select" value={cat} onChange={(e) => setQ({ ...q, cat: e.target.value })} aria-label="Categoria">
            <option value="">Tutte le categorie</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <input className="cv-select" style={{ minWidth: 170 }} list="cv-specialita" value={testo || ""}
                 onChange={(e) => setQ({ ...q, testo: e.target.value })}
                 placeholder="Cerca: arpista, DJ…" aria-label="Cerca per specialità" />
          <datalist id="cv-specialita">
            {[...new Set(providers.map((p) => p.role).filter(Boolean))].sort().map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
          <span style={{ fontSize: 13, color: "var(--grigio)", fontWeight: 600 }}>
            {results.length} disponibil{results.length === 1 ? "e" : "i"}
          </span>
        </div>

        {loading ? <Caricamento /> : results.length > 0 ? (
          <div className="cv-grid">
            {results.map((p) => (
              <ProviderCard key={p.id} p={p} onOpen={openProvider} eventType={etype} eventLoc={loc} />
            ))}
          </div>
        ) : (
          <div className="cv-empty cv-card-base">
            <b style={{ color: "var(--ink)", display: "block", marginBottom: 6 }}>
              {cerca ? `Nessun risultato per "${testo}"`
                : fascia ? "Nessun professionista in questa fascia di prezzo"
                : "Stiamo aggiungendo professionisti in questa zona"}
            </b>
            Prova un'altra data o un'altra categoria — oppure scrivici a{" "}
            <a href="mailto:info@clickeventi.it" style={{ color: "var(--accent)", fontWeight: 600 }}>
              info@clickeventi.it
            </a>{" "}
            e cerchiamo noi la persona giusta per il tuo evento.
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- profilo + preventivo ---------- */

function QuoteBuilder({ p, eventType, eventLoc, prefillDate }) {
  const def = defaultPackage(p, eventType);
  const [pkgId, setPkgId] = useState(def?.id);
  const [ore, setOre] = useState(def?.scale.included || 2);
  const [ospiti, setOspiti] = useState(30);
  const [persone, setPersone] = useState(1);
  const [extras, setExtras] = useState([]);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState("");
  const [form, setForm] = useState({ nome: "", contatto: "", note: "", orario: "" });
  const [privacyOk, setPrivacyOk] = useState(false);
  const [marketingOk, setMarketingOk] = useState(false);

  const pkg = p.packages.find((k) => k.id === pkgId) || p.packages[0];
  if (!pkg) return <div className="cv-panel cv-card-base">Nessun pacchetto disponibile.</div>;

  const quote = computeQuote(p, pkg, ore, pkg.scale.on === "persone" ? persone : ospiti, extras, eventLoc);
  const toggle = (id) => setExtras((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const selectPkg = (k) => { setPkgId(k.id); if (k.scale.on === "ore") setOre(k.scale.included); };

  const invia = async () => {
    if (!form.nome.trim() || !form.contatto.trim()) {
      setErrore("Inserisci nome e un contatto per ricevere la risposta.");
      return;
    }
    if (!privacyOk) {
      setErrore("Per inviare la richiesta devi accettare l'informativa privacy.");
      return;
    }
    setErrore(""); setSaving(true);
    const { error } = await supabase.from("richieste").insert({
      fornitore_id: p.id,
      cliente_nome: form.nome,
      cliente_contatto: form.contatto,
      tipo_evento: eventType,
      data_evento: prefillDate || null,
      localita: eventLoc?.name || null,
      pacchetto: pkg.label,
      ore: pkg.scale.on === "ore" ? ore : null,
      ospiti: pkg.scale.on === "ospiti" ? ospiti : pkg.scale.on === "persone" ? persone : null,
      extra_scelti: p.extras.filter((e) => extras.includes(e.id)).map((e) => e.label),
      totale: quote.tot,
      note: form.note || null,
      orario: form.orario || null,
      consenso_marketing: marketingOk,
    });
    setSaving(false);
    if (error) { setErrore("Non è stato possibile inviare la richiesta. Riprova."); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="cv-panel cv-card-base cv-ok">
        <Check size={38} strokeWidth={2.5} />
        <h4 className="cv-display" style={{ fontSize: 20, marginBottom: 6 }}>Richiesta inviata</h4>
        <p style={{ fontSize: 14, color: "var(--grigio)" }}>
          Hai richiesto <b>{p.name}</b> — pacchetto "{pkg.label}", totale stimato <b>{quote.tot} €</b>.
          Il team Click Eventi verifica la disponibilità con il professionista e ti ricontatta al più presto.
        </p>
      </div>
    );
  }

  return (
    <div className="cv-panel cv-card-base cv-form">
      <h4 className="cv-display" style={{ fontSize: 19, marginBottom: 12 }}>Componi il preventivo</h4>

      <label>Pacchetto</label>
      {p.packages.map((k) => (
        <label key={k.id} className={"cv-pkg" + (k.id === pkgId ? " on" : "")}>
          <input type="radio" name="pkg" checked={k.id === pkgId} onChange={() => selectPkg(k)}
                 style={{ display: "none" }} />
          <span className="cv-pkg-event">{k.event === "Tutti" ? "Ogni evento" : k.event}</span>
          <b>{k.label} <span>{k.base + feeFor(p, eventLoc)} €</span></b>
          <small>{k.includes.join(" · ")}</small>
          {k.descrizione && k.id === pkgId && (
            <small style={{ display: "block", marginTop: 6, color: "var(--ink)", lineHeight: 1.5 }}>{k.descrizione}</small>
          )}
        </label>
      ))}

      {pkg.scale.on === "ore" && (
        <>
          <label htmlFor="q-ore"><Clock size={13} style={{ verticalAlign: "-2px" }} /> Durata (incluse {pkg.scale.included} {pkg.scale.included === 1 ? "ora" : "ore"})</label>
          <select id="q-ore" value={ore} onChange={(e) => setOre(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 8].filter((n) => n >= pkg.scale.included).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "ora" : "ore"}</option>
            ))}
          </select>
        </>
      )}
      {pkg.scale.on === "ospiti" && (
        <>
          <label htmlFor="q-ospiti"><Users size={13} style={{ verticalAlign: "-2px" }} /> Ospiti (inclusi {pkg.scale.included})</label>
          <input id="q-ospiti" type="number" min={1} max={500} value={ospiti}
                 onChange={(e) => setOspiti(Number(e.target.value) || 0)} />
        </>
      )}
      {pkg.scale.on === "persone" && (
        <>
          <label htmlFor="q-persone"><Users size={13} style={{ verticalAlign: "-2px" }} /> Persone</label>
          <input id="q-persone" type="number" min={1} max={20} value={persone}
                 onChange={(e) => setPersone(Number(e.target.value) || 1)} />
        </>
      )}

      {p.extras.length > 0 && (
        <>
          <label>Aggiungi extra</label>
          {p.extras.map((e) => (
            <label key={e.id} className="cv-opt" style={{ alignItems: "flex-start" }}>
              <input type="checkbox" checked={extras.includes(e.id)} onChange={() => toggle(e.id)} style={{ marginTop: 3 }} />
              <span style={{ flex: 1 }}>
                {e.label}
                {e.descrizione && (
                  <small style={{ display: "block", color: "var(--grigio)", fontSize: 12.5, lineHeight: 1.45, marginTop: 2 }}>
                    {e.descrizione}
                  </small>
                )}
              </span>
              <span className="cv-opt-price">+{e.price} €</span>
            </label>
          ))}
        </>
      )}

      <div style={{ marginTop: 14 }}>
        {quote.rows.map((r, i) => (
          <div className="cv-qrow" key={i}><span>{r.label}</span><span>{r.value} €</span></div>
        ))}
        <div className="cv-qtotal">
          <span>Totale stimato</span>
          <b className="cv-display">{quote.tot} €</b>
        </div>
      </div>

      <label htmlFor="q-nome">Il tuo nome</label>
      <input id="q-nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome e cognome" />
      <label htmlFor="q-contatto">Email o telefono</label>
      <input id="q-contatto" value={form.contatto} onChange={(e) => setForm({ ...form, contatto: e.target.value })} placeholder="Per ricontattarti" />
      {prefillDate && (
        <p className="cv-note" style={{ textAlign: "left", marginTop: 10 }}>
          <CalendarDays size={13} style={{ verticalAlign: "-2px" }} /> Data richiesta: {new Date(prefillDate).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })} · {eventLoc?.name}
        </p>
      )}
      <label htmlFor="q-orario">Orario indicativo (facoltativo)</label>
      <input id="q-orario" value={form.orario} onChange={(e) => setForm({ ...form, orario: e.target.value })}
             placeholder="Es. dalle 19 alle 24" />
      <label htmlFor="q-note">Note (facoltative)</label>
      <textarea id="q-note" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Location, orari, atmosfera che immagini…" />

      <label className="cv-opt" style={{ alignItems: "flex-start", marginTop: 14 }}>
        <input type="checkbox" checked={privacyOk} onChange={() => setPrivacyOk(!privacyOk)} style={{ marginTop: 3 }} />
        <span style={{ fontSize: 13, lineHeight: 1.5 }}>
          Ho letto e accetto l'<a href="/?privacy" target="_blank" style={{ color: "var(--accent)", fontWeight: 600 }}>informativa privacy</a> *
        </span>
      </label>
      <label className="cv-opt" style={{ alignItems: "flex-start" }}>
        <input type="checkbox" checked={marketingOk} onChange={() => setMarketingOk(!marketingOk)} style={{ marginTop: 3 }} />
        <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--grigio)" }}>
          Vorrei ricevere novità e suggerimenti da Click Eventi (facoltativo)
        </span>
      </label>

      {errore && <p style={{ color: "var(--accent)", fontSize: 13, marginTop: 10, fontWeight: 600 }}>{errore}</p>}

      <button className="cv-submit" onClick={invia} disabled={saving}>
        <Send size={16} /> {saving ? "Invio…" : `Invia richiesta · ${quote.tot} €`}
      </button>
      <p className="cv-note">Gratis e senza impegno. Ti ricontattiamo appena abbiamo la conferma.</p>
    </div>
  );
}

function ProfileView({ p, goBack, q }) {
  const [zoom, setZoom] = useState(null);
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const avail = q.date ? isAvailable(p, q.date) : null;

  return (
    <section className="cv-section">
      <div className="cv-container">
        <button className="cv-back" onClick={goBack}><ArrowLeft size={16} /> Torna ai risultati</button>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", margin: "14px 0 20px", flexWrap: "wrap" }}>
          {p.foto?.length > 0 ? (
            <div style={{ width: 88, height: 88, borderRadius: 18, overflow: "hidden", flexShrink: 0, border: "1px solid var(--linea)" }}>
              <img src={p.foto[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ) : (
            <div className="cv-avatar" style={{ width: 72, height: 72, fontSize: 25 }}>{initials}</div>
          )}
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 className="cv-display" style={{ fontSize: 28, fontWeight: 700 }}>{p.name}</h2>
            <div className="cv-role" style={{ fontSize: 15 }}>{p.role} · {catLabel(p.cat)}</div>
            <div className="cv-meta" style={{ marginTop: 6 }}>
              <span className="cv-star"><Star size={13} fill="#F0A32B" /> {p.rating}</span>
              <span>({p.reviews} recensioni)</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {p.city}</span>
              {p.verificato && <span style={{ color: "var(--accent)", fontWeight: 600 }}>✓ Verificato</span>}
              <span className="cv-bookings" style={{ marginTop: 0 }}><Check size={13} /> {p.bookings} eventi prenotati</span>
            </div>
            <div style={{ marginTop: 10 }}>
              {p.eventTypes.map((t) => <span key={t} className="cv-chip">{t}</span>)}
            </div>
            {avail !== null && (
              <p style={{ marginTop: 10, fontWeight: 600, fontSize: 13.5, color: avail ? "#1E9E6A" : "var(--accent)" }}>
                {avail ? "✓ Disponibile per la tua data" : "✗ Non disponibile per la data scelta — prova un altro giorno"}
              </p>
            )}
          </div>
        </div>

        <div className="cv-two">
          <div className="cv-panel cv-card-base">
            <h4 className="cv-display" style={{ fontSize: 19, marginBottom: 10 }}>Chi è</h4>
            <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{p.bio}</p>
            {p.foto?.length > 0 && (
              <>
                <h4 className="cv-display" style={{ fontSize: 16, margin: "18px 0 8px" }}>Foto</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {p.foto.map((u, i) => (
                    <div key={i} onClick={() => setZoom(u)} role="button" tabIndex={0}
                         onKeyDown={(e) => e.key === "Enter" && setZoom(u)}
                         style={{ cursor: "zoom-in", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid var(--linea)" }}>
                      <img src={u} alt={`${p.name} ${i + 1}`} loading="lazy"
                           style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  ))}
                </div>
              </>
            )}
            {p.videoLink && (
              <p style={{ marginTop: 12, fontSize: 14 }}>
                <a href={p.videoLink} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                  ▶ Guarda il video
                </a>
              </p>
            )}
          </div>

          <QuoteBuilder p={p} eventType={q.etype} eventLoc={q.loc} prefillDate={q.date} />
        </div>
      </div>

      {zoom && (
        <div className="cv-lb" onClick={() => setZoom(null)}>
          <button className="cv-lb-x" aria-label="Chiudi">×</button>
          <img src={zoom} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

/* ---------- app ---------- */

export default function ClickEventiV2() {
  const [view, setView] = useState("home");
  const [q, setQ] = useState({ loc: LOC_DEFAULT, date: "", etype: "Festa privata", cat: "", testo: "", prezzo: "" });
  const [provider, setProvider] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("fornitori")
        .select("*, pacchetti(*), extra(*), fasce(*), indisponibilita(giorno)")
        .eq("stato", "approvato");
      if (error) setErrore("Non riesco a caricare i professionisti. Riprova tra poco.");
      else setProviders((data || []).map(fromDb));
      setLoading(false);
    })();
  }, []);

  const goHome = () => { setView("home"); window.scrollTo(0, 0); };
  const onSearch = (query) => { setQ(query); setView("results"); window.scrollTo(0, 0); };
  const openProvider = (p) => { setProvider(p); setView("profile"); window.scrollTo(0, 0); };

  return (
    <div className="cv-root">
      <GlobalStyle />
      <Header goHome={goHome} />
      {errore && (
        <div className="cv-container" style={{ paddingTop: 20 }}>
          <div className="cv-empty cv-card-base">{errore}</div>
        </div>
      )}
      {view === "home" && <HomeView onSearch={onSearch} openProvider={openProvider} providers={providers} loading={loading} />}
      {view === "results" && <ResultsView q={q} setQ={setQ} openProvider={openProvider} goHome={goHome} providers={providers} loading={loading} />}
      {view === "profile" && provider && <ProfileView p={provider} goBack={() => setView("results")} q={q} />}
      <footer className="cv-footer">
        <div className="cv-container">
          <span><b className="cv-display" style={{ color: "var(--ink)" }}>Click<em style={{ color: "var(--accent)", fontStyle: "normal" }}>Eventi</em></b> — Il tuo evento, in un click.</span>
          <span><a href="/?privacy" style={{ color: "var(--grigio)", fontWeight: 600 }}>Privacy e cookie</a> · I professionisti mostrati sono profili di esempio</span>
        </div>
      </footer>
    </div>
  );
}
