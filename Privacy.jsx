import { Shield } from "lucide-react";

/* ============================================================
   CLICK EVENTI — Informativa privacy
   Testo fornito dal legale e riportato integralmente.
   Non modificare il contenuto senza indicazione dell'avvocato.
   ============================================================ */

const Style = () => (
  <style>{`
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .pv-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .pv-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .pv-wrap{max-width:780px;margin:0 auto;padding:0 20px}
    .pv-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .pv-logo em{font-style:normal;color:var(--accent)}
    .pv-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:34px;margin:24px 0 40px}
    .pv-card h1{font-family:'Sora',sans-serif;font-size:24px;line-height:1.35;margin-bottom:8px}
    .pv-agg{color:var(--grigio);font-size:13.5px;font-style:italic;margin-bottom:26px}
    .pv-card h2{font-family:'Sora',sans-serif;font-size:19px;margin:32px 0 10px}
    .pv-card h3{font-size:15.5px;font-weight:700;margin:20px 0 8px}
    .pv-card p{font-size:15px;line-height:1.75;color:#3A3552;margin-bottom:12px}
    .pv-card a{color:var(--accent);font-weight:600}
    .pv-el{list-style:none;margin:0 0 12px;padding:0}
    .pv-el li{font-size:15px;line-height:1.75;color:#3A3552;margin-bottom:9px;padding-left:18px;position:relative}
    .pv-el li::before{content:"–";position:absolute;left:0;color:var(--grigio)}
    .pv-icon{width:46px;height:46px;border-radius:13px;background:#F3EFFE;color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:18px}
    .pv-tab{width:100%;border-collapse:collapse;margin:14px 0 20px;font-size:13.5px}
    .pv-tab th{text-align:left;background:var(--bg2);padding:11px 12px;font-weight:700;border:1px solid var(--linea);vertical-align:top}
    .pv-tab td{padding:11px 12px;border:1px solid var(--linea);vertical-align:top;line-height:1.6;color:#3A3552}
    .pv-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
    @media(max-width:600px){.pv-card{padding:24px 20px}.pv-tab{font-size:12.5px;min-width:560px}}
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

          <h1>
            Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del
            Regolamento (UE) 2016/679 e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018
          </h1>
          <p className="pv-agg">Ultimo aggiornamento: 01/10/2026</p>

          <h2>1. Titolare del trattamento e contatti</h2>
          <p>Il Titolare del trattamento dei dati personali è <b>Susanna Manca</b>.</p>
          <p>
            Per qualsiasi richiesta relativa al trattamento dei dati personali, l'interessato può
            scrivere all'indirizzo e-mail: <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>.
          </p>

          <h2>2. Introduzione e ruoli</h2>
          <p>
            La presente informativa è resa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679
            (di seguito "GDPR") e del D.Lgs. 196/2003 (Codice in materia di protezione dei dati
            personali, come modificato dal D.Lgs. 101/2018), e descrive le modalità di trattamento dei
            dati personali degli utenti che visitano il sito web clickeventi.it (di seguito il "Sito").
          </p>

          <h3>2.1 Ruoli e responsabilità</h3>
          <p>
            Il Titolare ha adottato misure tecniche e organizzative adeguate per garantire la sicurezza
            dei dati personali trattati attraverso il Sito. L'utente è tuttavia responsabile della
            custodia delle proprie credenziali di accesso e dei dati inseriti nel Sito.
          </p>
          <p>
            Le informazioni relative ai dati che non sono raccolti presso l'interessato (art. 14 GDPR)
            sono indicate ai punti 3 e 6.
          </p>
          <p>
            Fatti salvi gli obblighi previsti dalla normativa vigente, il Titolare non potrà essere
            ritenuto responsabile per eventuali danni derivanti dall'uso improprio del Sito da parte
            dell'utente o di terzi.
          </p>

          <h2>3. Dati raccolti</h2>

          <h3>3.1 Dati forniti volontariamente dall'utente</h3>
          <p>
            Il Titolare raccoglie i dati personali forniti volontariamente dall'utente al momento della
            compilazione dei moduli presenti sul Sito (ad esempio, nome, cognome, indirizzo e-mail,
            numero di telefono, messaggio o richiesta).
          </p>

          <h3>3.2 Dati di navigazione</h3>
          <p>
            I sistemi informatici e le procedure software preposte al funzionamento del Sito
            acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui
            trasmissione è implicita nell'uso dei protocolli di comunicazione Internet. Si tratta di
            informazioni che non sono raccolte per essere associate a interessati identificati, ma che
            per loro stessa natura potrebbero, attraverso elaborazioni e associazioni con dati detenuti
            da terzi, permettere di identificare gli utenti. In questa categoria di dati rientrano gli
            indirizzi IP, i nomi a dominio dei computer utilizzati dagli utenti che si connettono al
            Sito, gli indirizzi in notazione URI (Uniform Resource Identifier) delle risorse richieste,
            l'orario della richiesta, il metodo utilizzato nel sottoporre la richiesta al server, la
            dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della
            risposta data dal server e altri parametri relativi al sistema operativo e all'ambiente
            informatico dell'utente.
          </p>

          <h3>3.3 Dati raccolti tramite cookie e tecnologie simili</h3>
          <p>
            Il Sito utilizza cookie e tecnologie analoghe. Per maggiori informazioni si rimanda al
            punto 9 della presente informativa.
          </p>

          <h3>3.4 Dati relativi alle recensioni</h3>
          <p>
            L'utente che riceve un collegamento personale per lasciare una recensione può fornire un
            testo, una valutazione e, se richiesto, il proprio nome o pseudonimo. Questi dati sono
            trattati per la pubblicazione della recensione sul Sito.
          </p>

          <h3>3.5 Dati di categorie particolari</h3>
          <p>
            Il Titolare non richiede intenzionalmente dati di categorie particolari (art. 9 GDPR),
            quali dati che rivelino l'origine razziale o etnica, le opinioni politiche, le convinzioni
            religiose, l'appartenenza sindacale, dati genetici, dati biometrici, dati relativi alla
            salute o alla vita sessuale o all'orientamento sessuale dell'interessato. Qualora l'utente
            inserisca volontariamente tali dati nei campi a testo libero,
          </p>
          <p>
            il Titolare non li utilizzerà per alcuna finalità ulteriore e procederà, non appena ne
            abbia conoscenza, alla loro cancellazione o oscuramento, salvo che il trattamento sia
            strettamente necessario per l'accertamento, l'esercizio o la difesa di un diritto
            (art. 9.2.f GDPR).
          </p>
          <p>
            L'utente garantisce che i dati personali di terzi eventualmente inseriti nel Sito siano
            trattati nel rispetto della normativa vigente e che il conferimento avvenga con il consenso
            del terzo interessato o su altra base giuridica che legittimi il trattamento. Il Titolare
            informa i terzi interessati ai sensi dell'art. 14 GDPR rendendo disponibile la presente
            informativa; l'utente che inserisce dati di terzi è invitato a portarla a loro conoscenza.
          </p>

          <h2>4. Dati obbligatori e facoltativi</h2>
          <p>
            Nella tabella seguente sono indicati i dati raccolti tramite i moduli del Sito, con
            l'indicazione della loro natura obbligatoria o facoltativa.
          </p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "28%" }}>Dato</th>
                  <th style={{ width: "20%" }}>Natura</th>
                  <th>Conseguenze del mancato conferimento</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Nome e cognome</td><td>Obbligatorio</td><td>Impossibilità di identificare l'utente e di dare seguito alla richiesta</td></tr>
                <tr><td>Indirizzo e-mail</td><td>Obbligatorio</td><td>Impossibilità di contattare l'utente e di riscontrare la richiesta</td></tr>
                <tr><td>Numero di telefono</td><td>Facoltativo</td><td>Nessuna conseguenza; il dato può essere utile per un contatto più rapido</td></tr>
                <tr><td>Messaggio / richiesta</td><td>Obbligatorio</td><td>Impossibilità di comprendere l'oggetto della richiesta</td></tr>
                <tr><td>Dati contenuti negli allegati</td><td>Facoltativo</td><td>Nessuna conseguenza; l'utente può scegliere se allegare documentazione</td></tr>
                <tr><td>Testo e valutazione della recensione</td><td>Facoltativo</td><td>Impossibilità di pubblicare la recensione</td></tr>
              </tbody>
            </table>
          </div>

          <h2>5. Finalità e basi giuridiche del trattamento</h2>

          <h3>5.1 Gestione delle richieste di preventivo e contatto</h3>
          <p>
            I dati personali forniti tramite i moduli del Sito sono trattati per rispondere alle
            richieste dell'utente, fornire preventivi e gestire i contatti. Base giuridica: esecuzione
            di misure precontrattuali adottate su richiesta dell'interessato (art. 6.1.b GDPR).
          </p>

          <h3>5.2 Esecuzione del contratto</h3>
          <p>
            In caso di conferimento dell'incarico, i dati sono trattati per l'esecuzione del contratto
            e l'erogazione dei servizi richiesti. Base giuridica: esecuzione del contratto
            (art. 6.1.b GDPR).
          </p>

          <h3>5.3 Gestione delle recensioni</h3>
          <p>
            I dati sono trattati per consentire la pubblicazione e la gestione delle recensioni sul Sito.
          </p>
          <p>
            <b>Invito a recensire:</b> dopo la conclusione del servizio, il Titolare può inviare
            all'utente un'e-mail con un collegamento personale per lasciare una recensione.
          </p>
          <p>
            L'invito, inviato una sola volta tramite e-mail all'indirizzo fornito nell'ambito della
            richiesta, è strettamente connesso al servizio fruito e non ha contenuto promozionale;
            base giuridica: legittimo interesse del Titolare (art. 6.1.f). L'interessato può opporsi in
            ogni momento, gratuitamente, anche tramite il collegamento presente in ciascun messaggio.
          </p>
          <p>
            Possono recensire esclusivamente gli utenti che abbiano inviato una richiesta tramite il
            Sito e ricevuto il relativo collegamento personale.
          </p>
          <p>
            Il Titolare verifica che il collegamento sia inviato solo all'indirizzo e-mail associato a
            una richiesta effettivamente inoltrata; le recensioni non sono modificate né selezionate in
            base al loro esito positivo o negativo.
          </p>

          <h3>5.4 Gestione del sito web</h3>
          <p>
            I dati di navigazione sono trattati per il corretto funzionamento del Sito, per garantirne
            la sicurezza e per ottenere informazioni statistiche aggregate sull'utilizzo del Sito.
            Base giuridica: legittimo interesse del Titolare (art. 6.1.f GDPR).
          </p>

          <h3>5.5 Comunicazioni commerciali e promozionali</h3>
          <p>
            Con il consenso dell'utente, i dati potranno essere trattati per l'invio di comunicazioni
            commerciali e promozionali relative ai servizi offerti dal Titolare tramite e-mail. Base
            giuridica: consenso dell'interessato (art. 6.1.a GDPR e art. 130, comma 1 e 2,
            D.Lgs. 196/2003).
          </p>
          <p>
            Ogni comunicazione contiene un collegamento per revocare il consenso in modo semplice e
            gratuito; la revoca può essere esercitata anche scrivendo a info@clickeventi.it. I dati non
            sono utilizzati per finalità promozionali tramite SMS, telefono o messaggistica istantanea.
          </p>

          <h3>5.6 Miglioramento dei servizi</h3>
          <p>
            I dati potranno essere trattati in forma anonima o aggregata per analizzare e migliorare i
            servizi offerti dal Titolare. Base giuridica: legittimo interesse del Titolare
            (art. 6.1.f GDPR).
          </p>
          <p>
            Il Titolare ha effettuato una valutazione di bilanciamento ritenendo che tale interesse non
            prevalga sui diritti degli interessati in considerazione della limitatezza dei dati trattati
            e delle ragionevoli aspettative degli utenti.
          </p>

          <h3>5.7 Obblighi di legge e difesa dei diritti</h3>
          <p>
            Base giuridica: adempimento di un obbligo legale (art. 6.1.c GDPR) e legittimo interesse
            (art. 6.1.f GDPR). Finalità: adempimento di obblighi previsti dalla legge, da regolamenti o
            dalla normativa europea (ad es. obblighi fiscali e contabili ove applicabili, richieste
            delle autorità) e, se necessario, accertamento, esercizio o difesa di un diritto in sede
            giudiziale o stragiudiziale.
          </p>

          <h2>6. Fonti dei dati personali</h2>
          <p>
            I dati personali trattati dal Titolare sono raccolti direttamente presso l'interessato,
            attraverso la compilazione dei moduli del Sito o la navigazione sullo stesso. I dati di
            terzi eventualmente inseriti dall'utente nei campi a testo libero sono raccolti
            indirettamente.
          </p>

          <h2>7. Destinatari dei dati personali</h2>

          <h3>7.1 Categorie di destinatari</h3>
          <p>I dati personali potranno essere comunicati a:</p>
          <ul className="pv-el">
            <li>
              soggetti che forniscono servizi necessari al funzionamento del Sito e all'erogazione dei
              servizi richiesti (ad esempio, fornitori di servizi di hosting, invio e-mail, assistenza
              tecnica);
            </li>
            <li>
              autorità competenti, ove ciò sia richiesto dalla legge o necessario per la tutela dei
              diritti del Titolare;
            </li>
            <li>professionisti e consulenti, nei limiti di quanto strettamente necessario.</li>
          </ul>

          <h3>7.2 Elenco dei fornitori di servizi</h3>
          <p>
            I principali fornitori di servizi esterni attualmente utilizzati dal Titolare sono indicati
            nella tabella seguente.
          </p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "17%" }}>Fornitore</th>
                  <th style={{ width: "20%" }}>Servizio</th>
                  <th>Ruolo</th>
                  <th style={{ width: "17%" }}>Paese e garanzie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Supabase, Inc.</td>
                  <td>Database e autenticazione</td>
                  <td>Responsabile del trattamento (art. 28 GDPR)</td>
                  <td>USA – SCC e/o DPF</td>
                </tr>
                <tr>
                  <td>Vercel, Inc.</td>
                  <td>Hosting e distribuzione del Sito</td>
                  <td>
                    Responsabile del trattamento per i dati dell'utente elaborati per conto del
                    Titolare;
                    <br /><br />
                    titolare autonomo per i dati di utilizzo e i log generati dal servizio a fini di
                    sicurezza, fatturazione e miglioramento del servizio, come indicato
                    nell'informativa del fornitore{" "}
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
                      vercel.com/legal/privacy-policy
                    </a>
                  </td>
                  <td>USA – SCC e/o DPF</td>
                </tr>
                <tr>
                  <td>Resend, Inc.</td>
                  <td>Invio di e-mail transazionali e promozionali</td>
                  <td>Responsabile del trattamento (art. 28 GDPR)</td>
                  <td>USA – SCC e/o DPF</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>L'elenco aggiornato dei sub-responsabili è disponibile su richiesta.</p>

          <h3>7.3 Diffusione</h3>
          <p>
            I dati personali non sono oggetto di diffusione, salvo i dati relativi alle recensioni
            (testo, valutazione, nome o pseudonimo) che l'utente ha scelto di rendere pubblici.
          </p>

          <h2>8. Tabella riassuntiva dei trattamenti</h2>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Finalità</th>
                  <th style={{ width: "28%" }}>Dati trattati</th>
                  <th style={{ width: "24%" }}>Base giuridica</th>
                  <th>Conservazione</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Gestione richieste di preventivo e contatto (5.1)</td><td>Nome, cognome, e-mail, telefono, messaggio, allegati</td><td>Art. 6.1.b GDPR</td><td>V. punto 13</td></tr>
                <tr><td>Esecuzione del contratto (5.2)</td><td>Dati necessari all'esecuzione</td><td>Art. 6.1.b GDPR</td><td>V. punto 13</td></tr>
                <tr><td>Gestione recensioni (5.3)</td><td>E-mail, testo, valutazione, nome/pseudonimo</td><td>Art. 6.1.f GDPR</td><td>V. punto 13</td></tr>
                <tr><td>Gestione del sito web (5.4)</td><td>Dati di navigazione, log di sistema</td><td>Art. 6.1.f GDPR</td><td>V. punto 13</td></tr>
                <tr><td>Comunicazioni commerciali (5.5)</td><td>E-mail</td><td>Art. 6.1.a GDPR</td><td>V. punto 13</td></tr>
                <tr><td>Miglioramento dei servizi (5.6)</td><td>Dati in forma anonima/aggregata</td><td>Art. 6.1.f GDPR</td><td>V. punto 13</td></tr>
                <tr><td>Obblighi di legge e difesa dei diritti (5.7)</td><td>Tutti i dati necessari</td><td>Art. 6.1.c e 6.1.f GDPR</td><td>V. punto 13</td></tr>
              </tbody>
            </table>
          </div>

          <h2>9. Cookie e tecnologie di tracciamento</h2>
          <p>
            Il Sito utilizza cookie tecnici necessari al suo corretto funzionamento. Il riferimento ai
            "cookie" comprende anche la memoria locale del browser (local storage) e strumenti analoghi.
          </p>
          <p>Di seguito sono indicati i cookie utilizzati dal Sito.</p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Nome del cookie</th>
                  <th style={{ width: "14%" }}>Tipo</th>
                  <th>Finalità</th>
                  <th style={{ width: "17%" }}>Durata</th>
                  <th style={{ width: "14%" }}>Fornitore</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>sb-*-auth-token</td>
                  <td>Tecnico</td>
                  <td>Autenticazione e gestione della sessione utente (Supabase)</td>
                  <td>Sessione / persistente</td>
                  <td>Supabase</td>
                </tr>
                <tr>
                  <td>__vercel_live_token</td>
                  <td>Tecnico</td>
                  <td>Funzionamento del servizio di hosting (Vercel)</td>
                  <td>Sessione</td>
                  <td>Vercel</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Il Sito non utilizza cookie di profilazione propri. L'utente può gestire le preferenze
            relative ai cookie attraverso le impostazioni del proprio browser.
          </p>

          <h2>10. Trasferimenti di dati verso paesi terzi</h2>
          <p>
            I fornitori di servizi indicati al punto 7.2 hanno sede negli Stati Uniti. I trasferimenti
            di dati personali verso tali paesi avvengono sulla base di clausole contrattuali tipo
            approvate dalla Commissione europea (Standard Contractual Clauses, SCC) ovvero, per i
            fornitori certificati, la decisione di adeguatezza della Commissione del 10 luglio 2023
            relativa al Data Privacy Framework UE-USA (art. 45 GDPR).
          </p>
          <p>
            L'interessato può richiedere copia delle garanzie adottate scrivendo all'indirizzo e-mail
            indicato al punto 1.
          </p>

          <h2>11. Processi decisionali automatizzati</h2>
          <p>
            Il Titolare non adotta processi decisionali interamente automatizzati, compresa la
            profilazione, ai sensi dell'art. 22 GDPR.
          </p>

          <h2>12. Diritti dell'interessato</h2>
          <p>L'interessato può esercitare in qualsiasi momento i seguenti diritti:</p>
          <ul className="pv-el">
            <li>diritto di accesso (art. 15 GDPR): ottenere conferma dell'esistenza di un trattamento e accedere ai propri dati;</li>
            <li>diritto di rettifica (art. 16 GDPR): ottenere la correzione dei dati inesatti o l'integrazione dei dati incompleti;</li>
            <li>diritto alla cancellazione (art. 17 GDPR): ottenere la cancellazione dei propri dati, nei casi previsti dalla legge;</li>
            <li>diritto di limitazione (art. 18 GDPR): ottenere la limitazione del trattamento nei casi previsti;</li>
            <li>diritto alla portabilità (art. 20 GDPR): ricevere i propri dati in un formato strutturato, di uso comune e leggibile da dispositivo automatico;</li>
            <li>diritto di opposizione (art. 21 GDPR): opporsi al trattamento dei dati per motivi connessi alla propria situazione particolare;</li>
            <li>diritto di revocare il consenso (art. 7.3 GDPR): la revoca non pregiudica la liceità del trattamento basata sul consenso prima della revoca.</li>
          </ul>
          <p>
            <b>Diritto di opposizione:</b> l'interessato può opporsi in qualsiasi momento ai trattamenti
            fondati sul legittimo interesse (punti 5.3, 5.6 e 5.7) per motivi connessi alla propria
            situazione particolare, e in ogni momento e senza motivazione ai trattamenti per finalità
            promozionali.
          </p>
          <p>
            Per esercitare i diritti sopra indicati, l'interessato può inviare una richiesta
            all'indirizzo e-mail: <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>.
          </p>
          <p>
            Il Titolare può chiedere informazioni necessarie a verificare l'identità del richiedente
            (art. 12.6 GDPR).
          </p>
          <p>
            L'interessato ha inoltre il diritto di proporre reclamo all'Autorità Garante per la
            protezione dei dati personali (Piazza Venezia 11, 00187 Roma) ai sensi dell'art. 77 GDPR,
            o di ricorrere all'autorità giudiziaria (art. 79 GDPR).
          </p>

          <h2>13. Conservazione dei dati</h2>
          <p>
            I dati personali sono conservati per il tempo strettamente necessario al conseguimento
            delle finalità per le quali sono stati raccolti, nel rispetto del principio di limitazione
            della conservazione (art. 5.1.e GDPR). Di seguito i principali periodi di conservazione.
          </p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "36%" }}>Categoria di dati</th>
                  <th>Periodo di conservazione</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Richieste di preventivo e contatto</td><td>24 mesi dalla conclusione della richiesta o del rapporto contrattuale; per le richieste non concluse, 12 mesi dall'ultima attività</td></tr>
                <tr><td>Dati relativi alle recensioni</td><td>Per il tempo di pubblicazione della recensione sul Sito; l'utente può richiederne la cancellazione in qualsiasi momento</td></tr>
                <tr><td>Comunicazioni commerciali</td><td>Fino alla revoca del consenso</td></tr>
                <tr><td>Registri tecnici di sistema</td><td>Di norma non oltre 90 giorni, salvo necessità di conservazione ulteriore per accertare incidenti di sicurezza</td></tr>
                <tr><td>Dati necessari all'esercizio o alla difesa di un diritto</td><td>Per il periodo di prescrizione applicabile (di norma 10 anni, art. 2946 c.c., o il diverso termine previsto)</td></tr>
                <tr><td>Copie di sicurezza (backup)</td><td>Per il tempo necessario a garantire la continuità del servizio e il ripristino dei dati, con ciclo di rotazione.</td></tr>
              </tbody>
            </table>
          </div>

          <h2>14. Misure di sicurezza</h2>
          <p>
            Il Titolare adotta misure tecniche e organizzative adeguate per proteggere i dati personali
            contro la distruzione accidentale o illecita, la perdita, l'alterazione, la comunicazione
            non autorizzata o l'accesso ai dati personali trasmessi, conservati o comunque trattati.
            Tali misure comprendono, a titolo esemplificativo e non esaustivo: trasmissione dei dati
            tramite protocollo HTTPS/TLS, accesso limitato ai dati da parte del personale autorizzato,
            procedure di backup periodiche.
          </p>

          <h2>15. Minori</h2>
          <p>
            Il Sito e i servizi offerti non sono destinati a minori di 18 anni. Il Titolare non raccoglie
            intenzionalmente dati personali di minori.
          </p>
          <p>
            Il Titolare non è in grado di verificare l'età degli utenti; al momento della registrazione o
            dell'invio della richiesta l'utente dichiara di essere maggiorenne.
          </p>
          <p>
            Qualora il Titolare venga a conoscenza di aver raccolto dati personali di un minore senza il
            consenso del genitore o del tutore, provvederà alla cancellazione dei dati nel più breve
            tempo possibile. Il genitore o il tutore che ritenga che il proprio figlio o assistito abbia
            fornito dati personali attraverso il Sito è invitato a contattare il Titolare all'indirizzo
            e-mail indicato al punto 1. Il genitore o il tutore che inserisce dati del minore nel Sito
            dichiara di essere titolare della responsabilità genitoriale o di disporre
            dell'autorizzazione di chi la esercita, e si impegna a limitare tali dati allo stretto
            necessario; la pubblicazione di immagini di minori è consentita solo nel rispetto della
            normativa vigente (art. 96 L. 633/1941).
          </p>

          <h2>16. Modifiche alla presente informativa</h2>
          <p>
            Il Titolare si riserva il diritto di modificare, integrare o aggiornare la presente
            informativa in qualsiasi momento, in conformità alla normativa vigente. Le modifiche saranno
            efficaci dalla data indicata in apertura del documento. Si invita l'utente a consultare
            periodicamente la presente pagina.
          </p>
          <p>
            Le modifiche che comportino nuove finalità o nuove basi giuridiche fondate sul consenso
            saranno applicate solo previa raccolta del consenso, ove necessario.
          </p>

          <p style={{ marginTop: 32 }}>
            <a href="/">← Torna al sito</a>
          </p>
        </div>
      </div>
    </div>
  );
}
