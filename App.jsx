import { useState, useRef } from "react";
import {
  Music, Camera, Martini, PartyPopper, Sparkles,
  MapPin, Star, ArrowLeft, Search, Check, CalendarDays, Send, Users, Clock, Navigation
} from "lucide-react";

/* ============================================================
   CLICK EVENTI — v1.1 (prototipo)
   Ricerca per località con distanze reali in km,
   prezzi per fascia di distanza, pacchetti per tipo di evento.
   Dati dimostrativi. Nella versione online il campo località
   userà l'autocomplete di Google Maps (Places API).
   ============================================================ */

const EVENT_TYPES = ["Compleanno", "18esimo", "Festa privata", "Laurea", "Evento aziendale", "Matrimonio"];

const CATEGORIES = [
  { id: "musica", label: "Musica & DJ", icon: Music },
  { id: "foto", label: "Foto & Video", icon: Camera },
  { id: "barman", label: "Barman & Beverage", icon: Martini },
  { id: "animazione", label: "Animazione & Spettacolo", icon: PartyPopper },
  { id: "beauty", label: "Trucco & Hair", icon: Sparkles },
];

/* località con coordinate reali (demo — in produzione: Google Places) */
const LOCALITIES = [
  { id: "roma", name: "Roma", area: "RM", lat: 41.893, lng: 12.483 },
  { id: "fiumicino", name: "Fiumicino", area: "RM", lat: 41.766, lng: 12.229 },
  { id: "frascati", name: "Frascati", area: "RM", lat: 41.808, lng: 12.681 },
  { id: "tivoli", name: "Tivoli", area: "RM", lat: 41.963, lng: 12.798 },
  { id: "anzio", name: "Anzio", area: "RM", lat: 41.449, lng: 12.629 },
  { id: "latina", name: "Latina", area: "LT", lat: 41.467, lng: 12.904 },
  { id: "lecce", name: "Lecce", area: "LE", lat: 40.352, lng: 18.169 },
  { id: "squinzano", name: "Squinzano", area: "LE", lat: 40.434, lng: 18.045 },
  { id: "gallipoli", name: "Gallipoli", area: "LE", lat: 40.056, lng: 17.992 },
  { id: "otranto", name: "Otranto", area: "LE", lat: 40.146, lng: 18.490 },
  { id: "ostuni", name: "Ostuni", area: "BR", lat: 40.729, lng: 17.578 },
  { id: "brindisi", name: "Brindisi", area: "BR", lat: 40.632, lng: 17.936 },
  { id: "taranto", name: "Taranto", area: "TA", lat: 40.464, lng: 17.247 },
  { id: "bari", name: "Bari", area: "BA", lat: 41.117, lng: 16.871 },
  { id: "bracciano", name: "Bracciano", area: "RM", lat: 42.103, lng: 12.176 },
  { id: "ostia", name: "Ostia", area: "RM", lat: 41.731, lng: 12.276 },
  { id: "civitavecchia", name: "Civitavecchia", area: "RM", lat: 42.094, lng: 11.796 },
  { id: "velletri", name: "Velletri", area: "RM", lat: 41.686, lng: 12.777 },
  { id: "pomezia", name: "Pomezia", area: "RM", lat: 41.669, lng: 12.503 },
  { id: "guidonia", name: "Guidonia", area: "RM", lat: 42.001, lng: 12.726 },
  { id: "viterbo", name: "Viterbo", area: "VT", lat: 42.417, lng: 12.104 },
  { id: "nardo", name: "Nardò", area: "LE", lat: 40.180, lng: 18.033 },
  { id: "maglie", name: "Maglie", area: "LE", lat: 40.119, lng: 18.298 },
  { id: "casarano", name: "Casarano", area: "LE", lat: 40.008, lng: 18.161 },
  { id: "copertino", name: "Copertino", area: "LE", lat: 40.271, lng: 18.049 },
  { id: "monopoli", name: "Monopoli", area: "BA", lat: 40.949, lng: 17.298 },
  { id: "martina", name: "Martina Franca", area: "TA", lat: 40.705, lng: 17.336 },
  { id: "francavilla", name: "Francavilla Fontana", area: "BR", lat: 40.531, lng: 17.583 },
  { id: "manduria", name: "Manduria", area: "TA", lat: 40.401, lng: 17.634 },
];

/* tutte le province d'Italia (coordinate del capoluogo) */
const PROVINCES = [
  { id: "prov-to", name: "Provincia di Torino", area: "TO", lat: 45.07, lng: 7.686 },
  { id: "prov-vc", name: "Provincia di Vercelli", area: "VC", lat: 45.32, lng: 8.418 },
  { id: "prov-no", name: "Provincia di Novara", area: "NO", lat: 45.446, lng: 8.621 },
  { id: "prov-cn", name: "Provincia di Cuneo", area: "CN", lat: 44.384, lng: 7.542 },
  { id: "prov-at", name: "Provincia di Asti", area: "AT", lat: 44.9, lng: 8.206 },
  { id: "prov-al", name: "Provincia di Alessandria", area: "AL", lat: 44.913, lng: 8.615 },
  { id: "prov-bi", name: "Provincia di Biella", area: "BI", lat: 45.566, lng: 8.053 },
  { id: "prov-vb", name: "Provincia di Verbano-Cusio-Ossola", area: "VB", lat: 45.921, lng: 8.551 },
  { id: "prov-ao", name: "Provincia di Aosta", area: "AO", lat: 45.737, lng: 7.32 },
  { id: "prov-im", name: "Provincia di Imperia", area: "IM", lat: 43.887, lng: 8.027 },
  { id: "prov-sv", name: "Provincia di Savona", area: "SV", lat: 44.308, lng: 8.481 },
  { id: "prov-ge", name: "Provincia di Genova", area: "GE", lat: 44.407, lng: 8.934 },
  { id: "prov-sp", name: "Provincia di La Spezia", area: "SP", lat: 44.103, lng: 9.824 },
  { id: "prov-va", name: "Provincia di Varese", area: "VA", lat: 45.82, lng: 8.825 },
  { id: "prov-co", name: "Provincia di Como", area: "CO", lat: 45.808, lng: 9.085 },
  { id: "prov-so", name: "Provincia di Sondrio", area: "SO", lat: 46.17, lng: 9.879 },
  { id: "prov-mi", name: "Provincia di Milano", area: "MI", lat: 45.464, lng: 9.19 },
  { id: "prov-bg", name: "Provincia di Bergamo", area: "BG", lat: 45.698, lng: 9.677 },
  { id: "prov-bs", name: "Provincia di Brescia", area: "BS", lat: 45.539, lng: 10.22 },
  { id: "prov-pv", name: "Provincia di Pavia", area: "PV", lat: 45.185, lng: 9.155 },
  { id: "prov-cr", name: "Provincia di Cremona", area: "CR", lat: 45.133, lng: 10.024 },
  { id: "prov-mn", name: "Provincia di Mantova", area: "MN", lat: 45.156, lng: 10.791 },
  { id: "prov-lc", name: "Provincia di Lecco", area: "LC", lat: 45.856, lng: 9.397 },
  { id: "prov-lo", name: "Provincia di Lodi", area: "LO", lat: 45.314, lng: 9.503 },
  { id: "prov-mb", name: "Provincia di Monza e Brianza", area: "MB", lat: 45.584, lng: 9.274 },
  { id: "prov-bz", name: "Provincia di Bolzano", area: "BZ", lat: 46.498, lng: 11.354 },
  { id: "prov-tn", name: "Provincia di Trento", area: "TN", lat: 46.074, lng: 11.121 },
  { id: "prov-vr", name: "Provincia di Verona", area: "VR", lat: 45.438, lng: 10.992 },
  { id: "prov-vi", name: "Provincia di Vicenza", area: "VI", lat: 45.545, lng: 11.535 },
  { id: "prov-bl", name: "Provincia di Belluno", area: "BL", lat: 46.14, lng: 12.216 },
  { id: "prov-tv", name: "Provincia di Treviso", area: "TV", lat: 45.667, lng: 12.243 },
  { id: "prov-ve", name: "Provincia di Venezia", area: "VE", lat: 45.44, lng: 12.316 },
  { id: "prov-pd", name: "Provincia di Padova", area: "PD", lat: 45.407, lng: 11.876 },
  { id: "prov-ro", name: "Provincia di Rovigo", area: "RO", lat: 45.07, lng: 11.79 },
  { id: "prov-ud", name: "Provincia di Udine", area: "UD", lat: 46.071, lng: 13.235 },
  { id: "prov-go", name: "Provincia di Gorizia", area: "GO", lat: 45.941, lng: 13.622 },
  { id: "prov-ts", name: "Provincia di Trieste", area: "TS", lat: 45.649, lng: 13.777 },
  { id: "prov-pn", name: "Provincia di Pordenone", area: "PN", lat: 45.954, lng: 12.66 },
  { id: "prov-pc", name: "Provincia di Piacenza", area: "PC", lat: 45.052, lng: 9.693 },
  { id: "prov-pr", name: "Provincia di Parma", area: "PR", lat: 44.801, lng: 10.328 },
  { id: "prov-re", name: "Provincia di Reggio Emilia", area: "RE", lat: 44.698, lng: 10.63 },
  { id: "prov-mo", name: "Provincia di Modena", area: "MO", lat: 44.647, lng: 10.925 },
  { id: "prov-bo", name: "Provincia di Bologna", area: "BO", lat: 44.494, lng: 11.343 },
  { id: "prov-fe", name: "Provincia di Ferrara", area: "FE", lat: 44.838, lng: 11.62 },
  { id: "prov-ra", name: "Provincia di Ravenna", area: "RA", lat: 44.418, lng: 12.203 },
  { id: "prov-fc", name: "Provincia di Forlì-Cesena", area: "FC", lat: 44.223, lng: 12.041 },
  { id: "prov-rn", name: "Provincia di Rimini", area: "RN", lat: 44.06, lng: 12.566 },
  { id: "prov-ms", name: "Provincia di Massa-Carrara", area: "MS", lat: 44.036, lng: 10.139 },
  { id: "prov-lu", name: "Provincia di Lucca", area: "LU", lat: 43.844, lng: 10.502 },
  { id: "prov-pt", name: "Provincia di Pistoia", area: "PT", lat: 43.933, lng: 10.918 },
  { id: "prov-fi", name: "Provincia di Firenze", area: "FI", lat: 43.77, lng: 11.256 },
  { id: "prov-li", name: "Provincia di Livorno", area: "LI", lat: 43.548, lng: 10.311 },
  { id: "prov-pi", name: "Provincia di Pisa", area: "PI", lat: 43.716, lng: 10.397 },
  { id: "prov-ar", name: "Provincia di Arezzo", area: "AR", lat: 43.463, lng: 11.881 },
  { id: "prov-si", name: "Provincia di Siena", area: "SI", lat: 43.319, lng: 11.331 },
  { id: "prov-gr", name: "Provincia di Grosseto", area: "GR", lat: 42.76, lng: 11.114 },
  { id: "prov-po", name: "Provincia di Prato", area: "PO", lat: 43.881, lng: 11.096 },
  { id: "prov-pg", name: "Provincia di Perugia", area: "PG", lat: 43.111, lng: 12.39 },
  { id: "prov-tr", name: "Provincia di Terni", area: "TR", lat: 42.563, lng: 12.643 },
  { id: "prov-pu", name: "Provincia di Pesaro e Urbino", area: "PU", lat: 43.91, lng: 12.913 },
  { id: "prov-an", name: "Provincia di Ancona", area: "AN", lat: 43.616, lng: 13.519 },
  { id: "prov-mc", name: "Provincia di Macerata", area: "MC", lat: 43.3, lng: 13.453 },
  { id: "prov-ap", name: "Provincia di Ascoli Piceno", area: "AP", lat: 42.854, lng: 13.575 },
  { id: "prov-fm", name: "Provincia di Fermo", area: "FM", lat: 43.16, lng: 13.718 },
  { id: "prov-vt", name: "Provincia di Viterbo", area: "VT", lat: 42.417, lng: 12.104 },
  { id: "prov-ri", name: "Provincia di Rieti", area: "RI", lat: 42.404, lng: 12.857 },
  { id: "prov-rm", name: "Provincia di Roma", area: "RM", lat: 41.893, lng: 12.483 },
  { id: "prov-lt", name: "Provincia di Latina", area: "LT", lat: 41.467, lng: 12.904 },
  { id: "prov-fr", name: "Provincia di Frosinone", area: "FR", lat: 41.64, lng: 13.351 },
  { id: "prov-aq", name: "Provincia di L'Aquila", area: "AQ", lat: 42.35, lng: 13.399 },
  { id: "prov-te", name: "Provincia di Teramo", area: "TE", lat: 42.659, lng: 13.704 },
  { id: "prov-pe", name: "Provincia di Pescara", area: "PE", lat: 42.461, lng: 14.216 },
  { id: "prov-ch", name: "Provincia di Chieti", area: "CH", lat: 42.351, lng: 14.167 },
  { id: "prov-cb", name: "Provincia di Campobasso", area: "CB", lat: 41.56, lng: 14.663 },
  { id: "prov-is", name: "Provincia di Isernia", area: "IS", lat: 41.596, lng: 14.233 },
  { id: "prov-ce", name: "Provincia di Caserta", area: "CE", lat: 41.072, lng: 14.327 },
  { id: "prov-bn", name: "Provincia di Benevento", area: "BN", lat: 41.13, lng: 14.783 },
  { id: "prov-na", name: "Provincia di Napoli", area: "NA", lat: 40.852, lng: 14.268 },
  { id: "prov-av", name: "Provincia di Avellino", area: "AV", lat: 40.914, lng: 14.79 },
  { id: "prov-sa", name: "Provincia di Salerno", area: "SA", lat: 40.682, lng: 14.768 },
  { id: "prov-fg", name: "Provincia di Foggia", area: "FG", lat: 41.462, lng: 15.544 },
  { id: "prov-ba", name: "Provincia di Bari", area: "BA", lat: 41.117, lng: 16.871 },
  { id: "prov-ta", name: "Provincia di Taranto", area: "TA", lat: 40.464, lng: 17.247 },
  { id: "prov-br", name: "Provincia di Brindisi", area: "BR", lat: 40.632, lng: 17.936 },
  { id: "prov-le", name: "Provincia di Lecce", area: "LE", lat: 40.352, lng: 18.169 },
  { id: "prov-bt", name: "Provincia di Barletta-Andria-Trani", area: "BT", lat: 41.32, lng: 16.284 },
  { id: "prov-pz", name: "Provincia di Potenza", area: "PZ", lat: 40.64, lng: 15.806 },
  { id: "prov-mt", name: "Provincia di Matera", area: "MT", lat: 40.666, lng: 16.604 },
  { id: "prov-cs", name: "Provincia di Cosenza", area: "CS", lat: 39.298, lng: 16.253 },
  { id: "prov-cz", name: "Provincia di Catanzaro", area: "CZ", lat: 38.91, lng: 16.588 },
  { id: "prov-rc", name: "Provincia di Reggio Calabria", area: "RC", lat: 38.111, lng: 15.647 },
  { id: "prov-kr", name: "Provincia di Crotone", area: "KR", lat: 39.081, lng: 17.127 },
  { id: "prov-vv", name: "Provincia di Vibo Valentia", area: "VV", lat: 38.675, lng: 16.1 },
  { id: "prov-tp", name: "Provincia di Trapani", area: "TP", lat: 38.017, lng: 12.537 },
  { id: "prov-pa", name: "Provincia di Palermo", area: "PA", lat: 38.116, lng: 13.362 },
  { id: "prov-me", name: "Provincia di Messina", area: "ME", lat: 38.194, lng: 15.554 },
  { id: "prov-ag", name: "Provincia di Agrigento", area: "AG", lat: 37.311, lng: 13.577 },
  { id: "prov-cl", name: "Provincia di Caltanissetta", area: "CL", lat: 37.49, lng: 14.063 },
  { id: "prov-en", name: "Provincia di Enna", area: "EN", lat: 37.567, lng: 14.279 },
  { id: "prov-ct", name: "Provincia di Catania", area: "CT", lat: 37.507, lng: 15.083 },
  { id: "prov-rg", name: "Provincia di Ragusa", area: "RG", lat: 36.925, lng: 14.731 },
  { id: "prov-sr", name: "Provincia di Siracusa", area: "SR", lat: 37.075, lng: 15.287 },
  { id: "prov-ss", name: "Provincia di Sassari", area: "SS", lat: 40.726, lng: 8.556 },
  { id: "prov-nu", name: "Provincia di Nuoro", area: "NU", lat: 40.321, lng: 9.33 },
  { id: "prov-ca", name: "Provincia di Cagliari", area: "CA", lat: 39.223, lng: 9.122 },
  { id: "prov-or", name: "Provincia di Oristano", area: "OR", lat: 39.906, lng: 8.588 },
  { id: "prov-su", name: "Provincia di Sud Sardegna", area: "SU", lat: 39.167, lng: 8.522 },
];
const locById = (id) => LOCALITIES.find((l) => l.id === id);

function distanceKm(a, b) {
  if (!a || !b) return 0;
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/* fasce di distanza: fee aggiunta al pacchetto in base ai km dal fornitore */
const FASCE_STD = [
  { upTo: 30, fee: 0, label: "entro 30 km" },
  { upTo: 100, fee: 100, label: "entro 100 km" },
  { upTo: 99999, fee: 150, label: "oltre 100 km" },
];

function fasciaFor(km, fasce) {
  return fasce.find((f) => km <= f.upTo) || fasce[fasce.length - 1];
}

/* scale.on: "ore" | "ospiti" | "persone" | null (prezzo fisso) */
const PROVIDERS = [
  {
    id: 1, name: "Elisa Quaranta", role: "Violinista", cat: "musica", loc: "lecce",
    rating: 4.9, reviews: 27, bookings: 41,
    fasce: [
      { upTo: 30, fee: 0, label: "entro 30 km" },
      { upTo: 100, fee: 100, label: "entro 100 km" },
      { upTo: 99999, fee: 150, label: "oltre 100 km" },
    ],
    eventTypes: ["Matrimonio", "Evento aziendale", "Festa privata"],
    busy: [4, 11, 18, 25],
    bio: "Violinista diplomata al conservatorio. Repertorio classico, pop e colonne sonore, in solo o con quartetto: la colonna sonora elegante del vostro evento.",
    packages: [
      { id: "p1", label: "Cerimonia & Aperitivo", event: "Matrimonio", base: 350,
        includes: ["Cerimonia + aperitivo", "Repertorio concordato", "Sopralluogo incluso"],
        scale: { on: "ore", included: 2, extra: 120, label: "ora aggiuntiva" } },
      { id: "p2", label: "Set acustico", event: "Tutti", base: 150,
        includes: ["1 ora di esibizione", "Playlist su misura"],
        scale: { on: "ore", included: 1, extra: 120, label: "ora aggiuntiva" } },
    ],
    extras: [
      { id: "amp", label: "Amplificazione professionale", price: 50 },
      { id: "custom", label: "Brani su richiesta", price: 100 },
      { id: "quartetto", label: "Quartetto d'archi", price: 400 },
    ],
  },
  {
    id: 2, name: "DJ Marea", role: "DJ set & consolle", cat: "musica", loc: "roma",
    rating: 4.7, reviews: 33, bookings: 58, fasce: FASCE_STD,
    eventTypes: ["18esimo", "Compleanno", "Festa privata", "Matrimonio"],
    busy: [2, 9, 16, 23, 30],
    bio: "Dieci anni di piste da ballo tra club e feste private. Un unico interlocutore per la musica della tua serata, dal warm-up all'ultimo ballo.",
    packages: [
      { id: "p1", label: "Pacchetto 18esimo", event: "18esimo", base: 380,
        includes: ["3 ore di DJ set", "Impianto e luci base", "Playlist con il festeggiato"],
        scale: { on: "ore", included: 3, extra: 100, label: "ora aggiuntiva" } },
      { id: "p2", label: "DJ set matrimonio", event: "Matrimonio", base: 550,
        includes: ["4 ore di DJ set", "Impianto completo", "Coordinamento con la location"],
        scale: { on: "ore", included: 4, extra: 120, label: "ora aggiuntiva" } },
      { id: "p3", label: "Party base", event: "Tutti", base: 300,
        includes: ["2 ore di DJ set", "Impianto audio"],
        scale: { on: "ore", included: 2, extra: 100, label: "ora aggiuntiva" } },
    ],
    extras: [
      { id: "luci", label: "Luci pista extra", price: 90 },
      { id: "sax", label: "Sax live sul DJ set", price: 200 },
      { id: "karaoke", label: "Set karaoke", price: 80 },
    ],
  },
  {
    id: 3, name: "Duo Controcanto", role: "Voce & chitarra", cat: "musica", loc: "gallipoli",
    rating: 4.8, reviews: 41, bookings: 65, fasce: FASCE_STD,
    eventTypes: ["Matrimonio", "Festa privata", "Evento aziendale"],
    busy: [6, 13, 20, 27],
    bio: "Duo acustico voce e chitarra. Scaletta costruita insieme a voi: dall'aperitivo al taglio della torta, senza mai un momento vuoto.",
    packages: [
      { id: "p1", label: "Aperitivo live", event: "Tutti", base: 300,
        includes: ["90 minuti live", "Impianto incluso"],
        scale: { on: "ore", included: 2, extra: 130, label: "ora aggiuntiva" } },
      { id: "p2", label: "Matrimonio completo", event: "Matrimonio", base: 650,
        includes: ["Cerimonia + ricevimento", "4 ore live", "Scaletta su misura"],
        scale: { on: "ore", included: 4, extra: 130, label: "ora aggiuntiva" } },
    ],
    extras: [
      { id: "terzo", label: "Terzo elemento (basso/percussioni)", price: 180 },
      { id: "custom", label: "Brano dedicato arrangiato", price: 120 },
    ],
  },
  {
    id: 4, name: "Studio Lumen", role: "Fotografia di eventi", cat: "foto", loc: "roma",
    rating: 4.9, reviews: 58, bookings: 84,
    fasce: [
      { upTo: 50, fee: 0, label: "entro 50 km" },
      { upTo: 150, fee: 120, label: "entro 150 km" },
      { upTo: 99999, fee: 250, label: "oltre 150 km" },
    ],
    eventTypes: ["Matrimonio", "18esimo", "Compleanno", "Evento aziendale", "Laurea"],
    busy: [5, 12, 19, 26],
    bio: "Reportage senza pose forzate: raccontiamo la festa così com'è stata. Galleria online entro 30 giorni, album fine art su richiesta.",
    packages: [
      { id: "p1", label: "Reportage festa", event: "Tutti", base: 300,
        includes: ["2 ore di copertura", "Galleria online", "50+ scatti editati"],
        scale: { on: "ore", included: 2, extra: 130, label: "ora aggiuntiva" } },
      { id: "p2", label: "Matrimonio completo", event: "Matrimonio", base: 1500,
        includes: ["Giornata intera", "2 fotografi", "Galleria + selezione stampe"],
        scale: { on: "ore", included: 8, extra: 150, label: "ora aggiuntiva" } },
      { id: "p3", label: "Business & convention", event: "Evento aziendale", base: 450,
        includes: ["Mezza giornata", "Consegna rapida 72h", "Foto per social e stampa"],
        scale: { on: "ore", included: 4, extra: 120, label: "ora aggiuntiva" } },
    ],
    extras: [
      { id: "album", label: "Album fine art", price: 350 },
      { id: "secondo", label: "Secondo fotografo", price: 300 },
      { id: "sday", label: "Consegna same-day (50 scatti)", price: 200 },
    ],
  },
  {
    id: 5, name: "Frame & Co.", role: "Video di eventi", cat: "foto", loc: "lecce",
    rating: 4.6, reviews: 19, bookings: 28, fasce: FASCE_STD,
    eventTypes: ["Matrimonio", "18esimo", "Evento aziendale"],
    busy: [3, 10, 17, 24, 31],
    bio: "Video in stile cinematografico girati in due operatori. Aftermovie pronto in una settimana, perfetto per rivivere (e condividere) la festa.",
    packages: [
      { id: "p1", label: "Aftermovie evento", event: "Tutti", base: 450,
        includes: ["3 ore di riprese", "Video 3-5 minuti", "Formato social verticale"],
        scale: { on: "ore", included: 3, extra: 120, label: "ora aggiuntiva" } },
      { id: "p2", label: "Film di matrimonio", event: "Matrimonio", base: 1300,
        includes: ["Giornata intera", "Film 15-20 minuti", "Trailer in 7 giorni"],
        scale: { on: "ore", included: 8, extra: 140, label: "ora aggiuntiva" } },
    ],
    extras: [
      { id: "drone", label: "Riprese con drone", price: 150 },
      { id: "interviste", label: "Interviste agli ospiti", price: 120 },
    ],
  },
  {
    id: 6, name: "Shaker Bros", role: "Barman a domicilio", cat: "barman", loc: "roma",
    rating: 4.8, reviews: 36, bookings: 72, fasce: FASCE_STD,
    eventTypes: ["18esimo", "Compleanno", "Festa privata", "Evento aziendale", "Laurea"],
    busy: [1, 8, 15, 22, 29],
    bio: "Postazione bar completa a casa tua o in location: banco, attrezzatura, ghiaccio e drink list costruita sull'evento. Voi fate festa, ai cocktail pensiamo noi.",
    packages: [
      { id: "p1", label: "Open bar festa", event: "Tutti", base: 350,
        includes: ["Postazione completa 4 ore", "Fino a 30 ospiti", "Drink list classica"],
        scale: { on: "ospiti", included: 30, extra: 6, label: "ospite oltre i 30" } },
      { id: "p2", label: "Corporate cocktail", event: "Evento aziendale", base: 500,
        includes: ["Postazione premium", "Fino a 40 ospiti", "Drink analcolici inclusi"],
        scale: { on: "ospiti", included: 40, extra: 7, label: "ospite oltre i 40" } },
    ],
    extras: [
      { id: "flair", label: "Flair show (acrobazie)", price: 150 },
      { id: "list", label: "Drink list personalizzata", price: 80 },
      { id: "analc", label: "Corner analcolico kids", price: 90 },
    ],
  },
  {
    id: 7, name: "Salento Cocktail Lab", role: "Bar catering", cat: "barman", loc: "otranto",
    rating: 4.7, reviews: 24, bookings: 39, fasce: FASCE_STD,
    eventTypes: ["Matrimonio", "18esimo", "Festa privata", "Compleanno"],
    busy: [7, 14, 21, 28],
    bio: "Cocktail d'autore con prodotti del territorio: amari salentini, agrumi, erbe. La postazione bar che gli ospiti fotografano.",
    packages: [
      { id: "p1", label: "Open bar salentino", event: "Tutti", base: 380,
        includes: ["Postazione 4 ore", "Fino a 30 ospiti", "3 signature drink"],
        scale: { on: "ospiti", included: 30, extra: 6, label: "ospite oltre i 30" } },
      { id: "p2", label: "Wedding bar", event: "Matrimonio", base: 700,
        includes: ["Aperitivo + dopocena", "Fino a 60 ospiti", "Drink degli sposi dedicato"],
        scale: { on: "ospiti", included: 60, extra: 7, label: "ospite oltre i 60" } },
    ],
    extras: [
      { id: "gin", label: "Gin corner premium", price: 120 },
      { id: "frozen", label: "Postazione frozen estiva", price: 100 },
    ],
  },
  {
    id: 8, name: "Magic Party", role: "Animazione & magia", cat: "animazione", loc: "roma",
    rating: 4.9, reviews: 44, bookings: 91,
    fasce: [
      { upTo: 20, fee: 0, label: "entro 20 km" },
      { upTo: 60, fee: 50, label: "entro 60 km" },
      { upTo: 99999, fee: 120, label: "oltre 60 km" },
    ],
    eventTypes: ["Compleanno", "Festa privata"],
    busy: [4, 11, 18, 25],
    bio: "Animatori professionisti e uno spettacolo di magia che incanta anche i grandi. Feste di compleanno chiavi in mano, dai 4 ai 10 anni (e oltre).",
    packages: [
      { id: "p1", label: "Festa bimbi", event: "Compleanno", base: 180,
        includes: ["2 animatori per 3 ore", "Fino a 15 bambini", "Giochi e baby dance"],
        scale: { on: "ospiti", included: 15, extra: 5, label: "bambino oltre i 15" } },
      { id: "p2", label: "Show di magia", event: "Tutti", base: 250,
        includes: ["Spettacolo 50 minuti", "Coinvolgimento del festeggiato"],
        scale: { on: null } },
    ],
    extras: [
      { id: "trucca", label: "Truccabimbi", price: 80 },
      { id: "mascotte", label: "Mascotte a sorpresa", price: 90 },
      { id: "palloncini", label: "Sculture di palloncini", price: 60 },
    ],
  },
  {
    id: 9, name: "Follie di Festa", role: "Animazione & spettacolo", cat: "animazione", loc: "lecce",
    rating: 4.6, reviews: 21, bookings: 34, fasce: FASCE_STD,
    eventTypes: ["Compleanno", "18esimo", "Festa privata", "Laurea"],
    busy: [2, 9, 16, 23, 30],
    bio: "Dalla festa dei piccoli al party di laurea: animazione, giochi a squadre, quiz show e performer. L'energia che tiene viva la serata.",
    packages: [
      { id: "p1", label: "Party animato", event: "Tutti", base: 220,
        includes: ["2 animatori per 3 ore", "Fino a 20 ospiti", "Giochi e sfide a squadre"],
        scale: { on: "ospiti", included: 20, extra: 4, label: "ospite oltre i 20" } },
      { id: "p2", label: "Quiz show 18esimo", event: "18esimo", base: 280,
        includes: ["Quiz sul festeggiato", "Presentatore + tecnologia", "60 minuti di show"],
        scale: { on: null } },
    ],
    extras: [
      { id: "photo", label: "Photobooth con oggetti di scena", price: 150 },
      { id: "led", label: "Robot LED d'ingresso", price: 200 },
    ],
  },
  {
    id: 10, name: "Glow Studio", role: "Make-up & hair styling", cat: "beauty", loc: "roma",
    rating: 4.8, reviews: 31, bookings: 47,
    fasce: [
      { upTo: 25, fee: 0, label: "entro 25 km" },
      { upTo: 80, fee: 40, label: "entro 80 km" },
      { upTo: 99999, fee: 90, label: "oltre 80 km" },
    ],
    eventTypes: ["Matrimonio", "18esimo", "Laurea", "Festa privata"],
    busy: [6, 13, 20, 27],
    bio: "Trucco e acconciatura a domicilio per il tuo grande giorno: prova inclusa nei pacchetti sposa, tenuta garantita fino all'ultimo ballo.",
    packages: [
      { id: "p1", label: "Sposa completo", event: "Matrimonio", base: 280,
        includes: ["Prova trucco + acconciatura", "Il giorno dell'evento a domicilio", "Ritocco post-cerimonia"],
        scale: { on: "persone", included: 1, extra: 70, label: "persona in più (mamme, damigelle)" } },
      { id: "p2", label: "Glam party", event: "Tutti", base: 90,
        includes: ["Trucco + piega", "A domicilio"],
        scale: { on: "persone", included: 1, extra: 70, label: "persona in più" } },
    ],
    extras: [
      { id: "ciglia", label: "Applicazione ciglia", price: 25 },
      { id: "uomo", label: "Grooming sposo/festeggiato", price: 40 },
    ],
  },
  {
    id: 11, name: "Aura Beauty", role: "Make-up artist", cat: "beauty", loc: "squinzano",
    rating: 4.7, reviews: 18, bookings: 26, fasce: FASCE_STD,
    eventTypes: ["Matrimonio", "18esimo", "Laurea"],
    busy: [5, 12, 19, 26],
    bio: "Make-up luminoso e naturale, pensato per le foto e per durare. Specializzata in pelli mediterranee e trucco da cerimonia.",
    packages: [
      { id: "p1", label: "Cerimonia", event: "Tutti", base: 110,
        includes: ["Trucco completo a domicilio", "Prodotti long-lasting"],
        scale: { on: "persone", included: 1, extra: 65, label: "persona in più" } },
      { id: "p2", label: "Sposa con prova", event: "Matrimonio", base: 260,
        includes: ["Prova + giorno evento", "A domicilio", "Kit ritocco in omaggio"],
        scale: { on: "persone", included: 1, extra: 65, label: "persona in più" } },
    ],
    extras: [
      { id: "hair", label: "Acconciatura (con hair stylist partner)", price: 90 },
    ],
  },
];

const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || "";
const feeFor = (p, eventLoc) =>
  eventLoc ? fasciaFor(distanceKm(locById(p.loc), eventLoc), p.fasce).fee : 0;
const minPrice = (p, eventLoc) => Math.min(...p.packages.map((k) => k.base)) + feeFor(p, eventLoc);

function isAvailable(p, date) {
  if (!date) return true;
  return !p.busy.includes(new Date(date).getDate());
}

function defaultPackage(p, eventType) {
  return p.packages.find((k) => k.event === eventType) || p.packages.find((k) => k.event === "Tutti") || p.packages[0];
}

function computeQuote(p, pkg, ore, ospiti, selectedExtras, eventLoc) {
  const rows = [{ label: pkg.label, value: pkg.base }];
  let tot = pkg.base;

  if (pkg.scale.on === "ore" && ore > pkg.scale.included) {
    const n = ore - pkg.scale.included;
    rows.push({ label: `${n} × ${pkg.scale.label}`, value: n * pkg.scale.extra });
    tot += n * pkg.scale.extra;
  }
  if ((pkg.scale.on === "ospiti" || pkg.scale.on === "persone") && ospiti > pkg.scale.included) {
    const n = ospiti - pkg.scale.included;
    rows.push({ label: `${n} × ${pkg.scale.label}`, value: n * pkg.scale.extra });
    tot += n * pkg.scale.extra;
  }
  p.extras.forEach((e) => {
    if (selectedExtras.includes(e.id)) {
      rows.push({ label: e.label, value: e.price });
      tot += e.price;
    }
  });

  /* la distanza adatta il prezzo del pacchetto, senza comparire come voce */
  const fee = feeFor(p, eventLoc);
  if (fee > 0) {
    rows[0] = { label: rows[0].label, value: rows[0].value + fee };
    tot += fee;
  }
  return { rows, tot };
}

/* ---------- stile: pulito e luminoso, un solo accento ---------- */
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
      font: 600 13.5px 'Work Sans', sans-serif; color: var(--ink);
      background: var(--bg); border: 1px solid var(--linea); border-radius: 999px;
      padding: 8px 16px; cursor: pointer;
    }
    .cv-btn:hover { border-color: var(--ink); }

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
      display: grid; grid-template-columns: 1.3fr 1fr 1.1fr 1fr auto; gap: 0;
      max-width: 940px; margin: 0 auto; text-align: left;
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
    .cv-cats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .cv-cat {
      padding: 18px 16px; cursor: pointer; text-align: left;
      transition: border-color .15s ease, box-shadow .15s ease;
    }
    .cv-cat:hover { border-color: var(--ink); box-shadow: var(--ombra); }
    .cv-cat svg { color: var(--accent); margin-bottom: 10px; }
    .cv-cat span { display: block; font-weight: 600; font-size: 14px; line-height: 1.3; }

    /* card fornitore */
    .cv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
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
    .cv-card h3 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 17.5px; }
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
    .cv-two { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; align-items: start; }
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
    .cv-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .cv-step { padding: 22px; }
    .cv-step .cv-dot {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--accent-soft); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font: 700 14px 'Sora', sans-serif; margin-bottom: 12px;
    }
    .cv-step h4 { font-size: 15.5px; margin-bottom: 6px; font-weight: 600; }
    .cv-step p { font-size: 13.5px; color: var(--grigio); line-height: 1.55; }

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
    @media (prefers-reduced-motion: reduce) {
      .cv-card, .cv-cat { transition: none; }
    }
  `}</style>
);

/* ---------- campo località con suggerimenti (stile Maps) ---------- */
function LocationInput({ value, onChange, compact }) {
  const [text, setText] = useState(value ? value.name : "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const t = text.toLowerCase();
  const locMatches = LOCALITIES.filter((l) => l.name.toLowerCase().includes(t)).slice(0, 5);
  const provMatches = PROVINCES.filter(
    (l) => l.name.toLowerCase().includes(t) || l.area.toLowerCase() === t
  ).slice(0, 5);
  const matches = [...locMatches, ...provMatches].slice(0, 7);
  const fallback = locMatches.length === 0 && matches.length > 0 && t.length > 1;

  const pick = (l) => { onChange(l); setText(l.name); setOpen(false); };

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        value={text}
        placeholder="Cerca città o zona…"
        onChange={(e) => { setText(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="Località dell'evento"
        className={compact ? "cv-select" : undefined}
        style={compact ? { minWidth: 150 } : undefined}
      />
      {open && text.length > 0 && matches.length > 0 && (
        <div className="cv-locdrop">
          {fallback && (
            <div style={{ padding: "8px 14px", fontSize: 12, color: "var(--grigio)" }}>
              Seleziona la provincia più vicina:
            </div>
          )}
          {matches.map((l) => (
            <div key={l.id} className="cv-locitem" onMouseDown={() => pick(l)}>
              <MapPin size={15} /> {l.name} <small>{l.area}</small>
            </div>
          ))}
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
        <button className="cv-btn" onClick={() => alert("In v1 i professionisti vengono selezionati e caricati dal team Click Eventi. Scrivici!")}>
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
      <div className="cv-avatar">{initials}</div>
      <h3>{p.name}</h3>
      <div className="cv-role">{p.role} · {catLabel(p.cat)}</div>
      <div className="cv-meta">
        <span className="cv-star"><Star size={13} fill="#F0A32B" /> {p.rating}</span>
        <span>({p.reviews})</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={12} /> {locById(p.loc).name}
        </span>
      </div>
      <div className="cv-bookings"><Check size={13} /> {p.bookings} eventi prenotati su Click Eventi</div>
      <div className="cv-price">da {minPrice(p, eventLoc)} € <small>a pacchetto</small></div>
    </div>
  );
}

/* ---------- home ---------- */

function HomeView({ onSearch, openProvider }) {
  const [loc, setLoc] = useState(null);
  const [date, setDate] = useState("");
  const [etype, setEtype] = useState("Festa privata");
  const [cat, setCat] = useState("");
  const featured = [...PROVIDERS].sort((a, b) => b.bookings - a.bookings).slice(0, 6);
  const doSearch = () => onSearch({ loc: loc || locById("roma"), date, etype, cat });

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
            <span className="cv-flabel">Che evento è</span>
            <select value={etype} onChange={(e) => setEtype(e.target.value)} aria-label="Tipo di evento">
              {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="cv-field">
            <span className="cv-flabel">Cosa cerchi</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoria">
              <option value="">Tutto</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <button className="cv-search-btn" onClick={doSearch}>
            <Search size={17} /> Trova
          </button>
        </div>
        <p className="cv-note" style={{ marginTop: 14 }}>
          Prezzi tutto incluso per la tua zona: quello che vedi è quello che richiedi.
        </p>
      </section>

      <section className="cv-section" style={{ paddingTop: 12 }}>
        <div className="cv-container">
          <span className="cv-eyebrow">Categorie</span>
          <h2 className="cv-h2 cv-display">Chi ti serve per il tuo evento?</h2>
          <div className="cv-cats">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="cv-cat cv-card-base" role="button" tabIndex={0}
                     onClick={() => onSearch({ loc: loc || locById("roma"), date, etype, cat: c.id })}
                     onKeyDown={(e) => e.key === "Enter" && onSearch({ loc: loc || locById("roma"), date, etype, cat: c.id })}>
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
          <div className="cv-grid">
            {featured.map((p) => <ProviderCard key={p.id} p={p} onOpen={openProvider} />)}
          </div>
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
              <p>Vedi solo i professionisti davvero liberi per il tuo giorno, con la distanza da te calcolata in km.</p>
            </div>
            <div className="cv-step cv-card-base">
              <div className="cv-dot">2</div>
              <h4>Componi il preventivo</h4>
              <p>Scegli il pacchetto per il tuo evento, aggiungi ore, ospiti ed extra: il prezzo si aggiorna in diretta, distanza inclusa.</p>
            </div>
            <div className="cv-step cv-card-base">
              <div className="cv-dot">3</div>
              <h4>Invia la richiesta</h4>
              <p>Il team Click Eventi la gira al professionista e ti ricontatta con la conferma entro 24 ore.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- risultati ---------- */

function ResultsView({ q, setQ, openProvider, goHome }) {
  const { loc, date, etype, cat } = q;
  const results = PROVIDERS
    .filter((p) => (!cat || p.cat === cat) && isAvailable(p, date))
    .sort((a, b) => {
      const fa = a.eventTypes.includes(etype) ? 1 : 0;
      const fb = b.eventTypes.includes(etype) ? 1 : 0;
      if (fb !== fa) return fb - fa;
      const ka = distanceKm(locById(a.loc), loc), kb = distanceKm(locById(b.loc), loc);
      if (ka !== kb) return ka - kb;
      return b.rating - a.rating;
    });
  const dateLabel = date
    ? new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <section className="cv-section">
      <div className="cv-container">
        <button className="cv-back" onClick={goHome}><ArrowLeft size={16} /> Torna alla home</button>
        <h2 className="cv-h2 cv-display" style={{ marginTop: 8, marginBottom: 6 }}>
          {cat ? catLabel(cat) : "Professionisti"} per il tuo {etype.toLowerCase()}
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
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <span style={{ fontSize: 13, color: "var(--grigio)", fontWeight: 600 }}>
            {results.length} disponibil{results.length === 1 ? "e" : "i"}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="cv-grid">
            {results.map((p) => (
              <ProviderCard key={p.id} p={p} onOpen={openProvider} eventType={etype} eventLoc={loc} />
            ))}
          </div>
        ) : (
          <div className="cv-empty cv-card-base">
            Nessun professionista disponibile con questi filtri.<br />
            Prova un'altra data o allarga la categoria.
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- profilo + preventivo ---------- */

function QuoteBuilder({ p, eventType, eventLoc, prefillDate }) {
  const [pkgId, setPkgId] = useState(defaultPackage(p, eventType).id);
  const [ore, setOre] = useState(defaultPackage(p, eventType).scale.included || 2);
  const [ospiti, setOspiti] = useState(30);
  const [persone, setPersone] = useState(1);
  const [extras, setExtras] = useState([]);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", contatto: "", note: "" });

  const pkg = p.packages.find((k) => k.id === pkgId);
  const quote = computeQuote(p, pkg, ore, pkg.scale.on === "persone" ? persone : ospiti, extras, eventLoc);
  const toggle = (id) => setExtras((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const selectPkg = (k) => { setPkgId(k.id); if (k.scale.on === "ore") setOre(k.scale.included); };

  if (sent) {
    return (
      <div className="cv-panel cv-card-base cv-ok">
        <Check size={38} strokeWidth={2.5} />
        <h4 className="cv-display" style={{ fontSize: 20, marginBottom: 6 }}>Richiesta inviata</h4>
        <p style={{ fontSize: 14, color: "var(--grigio)" }}>
          Hai richiesto <b>{p.name}</b> — pacchetto "{pkg.label}", totale stimato <b>{quote.tot} €</b>.
          Il team Click Eventi verifica con il professionista e ti ricontatta entro 24 ore.
        </p>
        <p className="cv-note">Prototipo dimostrativo: nessuna email è stata realmente inviata.</p>
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
          <label htmlFor="q-persone"><Users size={13} style={{ verticalAlign: "-2px" }} /> Persone da truccare</label>
          <input id="q-persone" type="number" min={1} max={20} value={persone}
                 onChange={(e) => setPersone(Number(e.target.value) || 1)} />
        </>
      )}

      {p.extras.length > 0 && (
        <>
          <label>Aggiungi extra</label>
          {p.extras.map((e) => (
            <label key={e.id} className="cv-opt">
              <input type="checkbox" checked={extras.includes(e.id)} onChange={() => toggle(e.id)} />
              {e.label}
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
          <CalendarDays size={13} style={{ verticalAlign: "-2px" }} /> Data richiesta: {new Date(prefillDate).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })} · {eventLoc.name}
        </p>
      )}
      <label htmlFor="q-note">Note (facoltative)</label>
      <textarea id="q-note" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Location, orari, atmosfera che immagini…" />

      <button className="cv-submit" onClick={() => setSent(true)}>
        <Send size={16} /> Invia richiesta · {quote.tot} €
      </button>
      <p className="cv-note">Gratis e senza impegno. Ti risponde il team Click Eventi entro 24 ore.</p>
    </div>
  );
}

function ProfileView({ p, goBack, q }) {
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const avail = q.date ? isAvailable(p, q.date) : null;

  return (
    <section className="cv-section">
      <div className="cv-container">
        <button className="cv-back" onClick={goBack}><ArrowLeft size={16} /> Torna ai risultati</button>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", margin: "14px 0 20px", flexWrap: "wrap" }}>
          <div className="cv-avatar" style={{ width: 72, height: 72, fontSize: 25 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 className="cv-display" style={{ fontSize: 28, fontWeight: 700 }}>{p.name}</h2>
            <div className="cv-role" style={{ fontSize: 15 }}>{p.role} · {catLabel(p.cat)}</div>
            <div className="cv-meta" style={{ marginTop: 6 }}>
              <span className="cv-star"><Star size={13} fill="#F0A32B" /> {p.rating}</span>
              <span>({p.reviews} recensioni)</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {locById(p.loc).name}</span>
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
            <h4 className="cv-display" style={{ fontSize: 16, margin: "18px 0 8px" }}>Foto & video</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: 10, border: "1px dashed var(--linea)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--grigio)", background: "var(--bg2)",
                }}>
                  <Camera size={18} />
                </div>
              ))}
            </div>
            <p className="cv-note" style={{ textAlign: "left" }}>
              Le foto vengono caricate dal professionista e approvate dal team Click Eventi.
            </p>
            <h4 className="cv-display" style={{ fontSize: 16, margin: "18px 0 6px" }}>Recensioni recenti</h4>
            <ul className="cv-list">
              <li><Check size={15} /> "Puntuali, professionali e super. Evento riuscitissimo!" — Giulia, {p.eventTypes[0]}</li>
              <li><Check size={15} /> "Preventivo chiaro fin da subito, nessuna sorpresa." — Andrea, {p.eventTypes[p.eventTypes.length - 1]}</li>
            </ul>
          </div>

          <QuoteBuilder p={p} eventType={q.etype} eventLoc={q.loc} prefillDate={q.date} />
        </div>
      </div>
    </section>
  );
}

/* ---------- app ---------- */

export default function ClickEventiV1() {
  const [view, setView] = useState("home");
  const [q, setQ] = useState({ loc: locById("roma"), date: "", etype: "Festa privata", cat: "" });
  const [provider, setProvider] = useState(null);

  const goHome = () => { setView("home"); window.scrollTo(0, 0); };
  const onSearch = (query) => { setQ(query); setView("results"); window.scrollTo(0, 0); };
  const openProvider = (p) => { setProvider(p); setView("profile"); window.scrollTo(0, 0); };

  return (
    <div className="cv-root">
      <GlobalStyle />
      <Header goHome={goHome} />
      {view === "home" && <HomeView onSearch={onSearch} openProvider={openProvider} />}
      {view === "results" && <ResultsView q={q} setQ={setQ} openProvider={openProvider} goHome={goHome} />}
      {view === "profile" && provider && <ProfileView p={provider} goBack={() => setView("results")} q={q} />}
      <footer className="cv-footer">
        <div className="cv-container">
          <span><b className="cv-display" style={{ color: "var(--ink)" }}>Click<em style={{ color: "var(--accent)", fontStyle: "normal" }}>Eventi</em></b> — Il tuo evento, in un click.</span>
          <span>Prototipo v1.1 · Profili, distanze e prenotazioni sono dati di esempio</span>
        </div>
      </footer>
    </div>
  );
}
