import { Shield } from "lucide-react";

/* ============================================================
   CLICK EVENTI — Informativa privacy e cookie
   Testo redatto per la fase di avvio (titolare persona fisica).
   Da far rivedere a un professionista alla costituzione della società.
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .pv-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .pv-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .pv-wrap{max-width:720px;margin:0 auto;padding:0 20px}
    .pv-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .pv-logo em{font-style:normal;color:var(--accent)}
    .pv-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:34px;margin:24px 0 40px}
    .pv-card h1{font-family:'Sora',sans-serif;font-size:27px;margin-bottom:6px}
    .pv-agg{color:var(--grigio);font-size:13px;margin-bottom:26px}
    .pv-card h2{font-family:'Sora',sans-serif;font-size:17.5px;margin:28px 0 9px}
    .pv-card p{font-size:15px;line-height:1.7;color:#3A3552;margin-bottom:11px}
    .pv-card ul{margin:0 0 12px 20px}
    .pv-card li{font-size:15px;line-height:1.7;color:#3A3552;margin-bottom:5px}
    .pv-card a{color:var(--accent);font-weight:600}
    .pv-box{background:var(--bg2);border-radius:12px;padding:16px 18px;margin:16px 0}
    .pv-box p{margin:0;font-size:14.5px}
    .pv-icon{width:46px;height:46px;border-radius:13px;background:#F3EFFE;color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
  `}</style>
);

export default function Privacy() {
  return (
    <div className="pv-root"><Style />
      <header className="pv-head">
        <div className="pv-wrap"><a href="/" className="pv-logo">Click<em>Eventi</em></a></div>
      </header>

      <div className="pv-wrap">
        <div className="pv-card">
          <div className="pv-icon"><Shield size={24} /></div>
          <h1>Informativa privacy e cookie</h1>
          <p className="pv-agg">Ultimo aggiornamento: 29 agosto 2026</p>

          <p>
            Questa informativa spiega quali dati personali raccogliamo su clickeventi.it,
            perché li raccogliamo e quali diritti hai. È redatta ai sensi del Regolamento
            UE 2016/679 (GDPR).
          </p>

          <h2>Chi tratta i tuoi dati</h2>
          <p>
            Il titolare del trattamento è <b>Susanna Manca</b>.
            Per qualsiasi richiesta puoi scrivere a{" "}
            <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>.
          </p>

          <h2>Quali dati raccogliamo</h2>
          <p><b>Se invii una richiesta di preventivo:</b></p>
          <ul>
            <li>nome e cognome</li>
            <li>email oppure numero di telefono</li>
            <li>dettagli dell'evento: tipo, data, località, servizio scelto, eventuali note</li>
          </ul>
          <p><b>Se ti iscrivi come professionista:</b></p>
          <ul>
            <li>email e password (la password è cifrata e non è visibile a nessuno)</li>
            <li>nome o nome d'arte, attività svolta, città, telefono</li>
            <li>listino, tariffe, foto e link che scegli di pubblicare</li>
          </ul>
          <p>
            Non raccogliamo dati particolari (salute, opinioni politiche o religiose) e
            non chiediamo documenti d'identità.
          </p>

          <h2>Perché li usiamo</h2>
          <ul>
            <li><b>Gestire la tua richiesta</b> e metterti in contatto con il professionista.
              Base giuridica: esecuzione di misure precontrattuali su tua richiesta (art. 6.1.b GDPR).</li>
            <li><b>Pubblicare il profilo</b> dei professionisti iscritti, con i dati che ci forniscono.
              Base giuridica: contratto (art. 6.1.b GDPR).</li>
            <li><b>Inviarti comunicazioni</b> su novità e servizi, <b>solo se dai il consenso</b>
              spuntando l'apposita casella. Base giuridica: consenso (art. 6.1.a GDPR),
              revocabile in ogni momento.</li>
          </ul>

          <h2>A chi li comunichiamo</h2>
          <p>
            I dettagli della tua richiesta vengono condivisi con il professionista che hai
            scelto, perché possa risponderti. Non vendiamo né cediamo i tuoi dati a terzi
            per finalità commerciali.
          </p>
          <p>Ci appoggiamo a fornitori tecnici che trattano i dati per nostro conto:</p>
          <ul>
            <li><b>Supabase</b> — database e autenticazione (server nell'Unione Europea, Francoforte)</li>
            <li><b>Vercel</b> — pubblicazione del sito</li>
            <li><b>Resend</b> — invio delle email</li>
          </ul>

          <h2>Per quanto tempo li conserviamo</h2>
          <ul>
            <li>Richieste di preventivo: <b>24 mesi</b> dall'invio</li>
            <li>Profili dei professionisti: finché l'account resta attivo</li>
            <li>Consenso alle comunicazioni: fino a revoca</li>
          </ul>
          <p>Puoi chiederci la cancellazione anche prima, in qualsiasi momento.</p>

          <h2>Cookie</h2>
          <p>
            Il sito usa <b>solo cookie tecnici</b>, necessari al funzionamento: servono a
            mantenere attiva la sessione di chi accede all'area professionisti. Per questi
            cookie non è richiesto il consenso.
          </p>
          <p>
            <b>Non usiamo</b> cookie di profilazione, pubblicitari o di statistica
            (nessun Google Analytics o strumento simile). Se in futuro li introdurremo,
            aggiorneremo questa pagina e ti chiederemo il consenso.
          </p>

          <h2>I tuoi diritti</h2>
          <p>In qualsiasi momento puoi chiedere di:</p>
          <ul>
            <li>sapere quali dati abbiamo su di te e ottenerne copia</li>
            <li>correggerli se sono sbagliati o incompleti</li>
            <li>cancellarli</li>
            <li>limitarne o opporti al trattamento</li>
            <li>revocare il consenso alle comunicazioni</li>
          </ul>
          <div className="pv-box">
            <p>
              Per esercitare questi diritti scrivi a{" "}
              <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>:
              ti rispondiamo entro 30 giorni. Se ritieni che i tuoi dati siano trattati
              in modo scorretto, puoi rivolgerti al Garante per la protezione dei dati
              personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">garanteprivacy.it</a>).
            </p>
          </div>

          <h2>Minori</h2>
          <p>
            Il servizio è rivolto a maggiorenni. Non raccogliamo consapevolmente dati di
            minori di 14 anni; se ci accorgiamo che è successo, li cancelliamo.
          </p>

          <h2>Modifiche</h2>
          <p>
            Possiamo aggiornare questa informativa: la data in cima indica sempre
            l'ultima versione.
          </p>

          <p style={{ marginTop: 28 }}>
            <a href="/">← Torna al sito</a>
          </p>
        </div>
      </div>
    </div>
  );
}
