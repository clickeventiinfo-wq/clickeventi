import { Shield } from "lucide-react";

/* ============================================================
   CLICK EVENTI — Informativa privacy e cookie
   Struttura conforme agli artt. 13-14 GDPR.
   ⚠️ Testo predisposto per la revisione di un legale.
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .pv-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .pv-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .pv-wrap{max-width:760px;margin:0 auto;padding:0 20px}
    .pv-logo{font-family:'Sora',sans-serif;font-weight:700;font-size:20px;text-decoration:none;color:inherit}
    .pv-logo em{font-style:normal;color:var(--accent)}
    .pv-card{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:34px;margin:24px 0 40px}
    .pv-card h1{font-family:'Sora',sans-serif;font-size:27px;margin-bottom:6px}
    .pv-agg{color:var(--grigio);font-size:13px;margin-bottom:24px}
    .pv-card h2{font-family:'Sora',sans-serif;font-size:18px;margin:30px 0 10px;scroll-margin-top:70px}
    .pv-card h3{font-size:15px;font-weight:700;margin:18px 0 7px}
    .pv-card p{font-size:15px;line-height:1.7;color:#3A3552;margin-bottom:11px}
    .pv-card ul{margin:0 0 12px 20px}
    .pv-card li{font-size:15px;line-height:1.7;color:#3A3552;margin-bottom:5px}
    .pv-card a{color:var(--accent);font-weight:600}
    .pv-box{background:var(--bg2);border-radius:12px;padding:16px 18px;margin:16px 0}
    .pv-box p{margin:0;font-size:14.5px}
    .pv-icon{width:46px;height:46px;border-radius:13px;background:#F3EFFE;color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
    .pv-indice{background:var(--bg2);border-radius:12px;padding:18px 20px;margin-bottom:8px}
    .pv-indice ol{margin:0 0 0 18px}
    .pv-indice li{font-size:14.5px;margin-bottom:4px}
    .pv-tab{width:100%;border-collapse:collapse;margin:14px 0 18px;font-size:13.5px}
    .pv-tab th{text-align:left;background:var(--bg2);padding:10px 12px;font-weight:700;border-bottom:1px solid var(--linea);vertical-align:top}
    .pv-tab td{padding:10px 12px;border-bottom:1px solid var(--linea);vertical-align:top;line-height:1.55;color:#3A3552}
    .pv-scroll{overflow-x:auto}
    @media(max-width:600px){.pv-card{padding:24px 20px}.pv-tab{font-size:12.5px}}
  `}</style>
);

const S = ({ id, children }) => <h2 id={id}>{children}</h2>;

export default function Privacy() {
  return (
    <div className="pv-root"><Style />
      <header className="pv-head">
        <div className="pv-wrap"><a href="/" className="pv-logo">Click<em>Eventi</em></a></div>
      </header>

      <div className="pv-wrap">
        <div className="pv-card">
          <div className="pv-icon"><Shield size={24} /></div>
          <h1>Informativa sulla privacy</h1>
          <p className="pv-agg">Ultima modifica: ottobre 2026</p>

          <div className="pv-indice">
            <b style={{ fontSize: 13.5, display: "block", marginBottom: 8 }}>Indice</b>
            <ol>
              <li><a href="#c1">Titolare del trattamento e contatti</a></li>
              <li><a href="#c2">Introduzione</a></li>
              <li><a href="#c3">Quali dati personali raccogliamo</a></li>
              <li><a href="#c4">Come utilizziamo i dati personali</a></li>
              <li><a href="#c5">Da quali fonti raccogliamo i dati</a></li>
              <li><a href="#c6">A chi comunichiamo i dati</a></li>
              <li><a href="#c7">Tabella riassuntiva dei trattamenti</a></li>
              <li><a href="#c8">Cookie e strumenti di tracciamento</a></li>
              <li><a href="#c9">Diritti dell'interessato</a></li>
              <li><a href="#c10">Trasferimenti internazionali di dati</a></li>
              <li><a href="#c11">Per quanto tempo conserviamo i dati</a></li>
              <li><a href="#c12">Come proteggiamo i dati</a></li>
              <li><a href="#c13">Dati dei minori</a></li>
              <li><a href="#c14">Modifiche all'informativa</a></li>
            </ol>
          </div>

          {/* 1 */}
          <S id="c1">1. Titolare del trattamento e contatti</S>
          <p>
            Il Titolare del trattamento dei dati personali raccolti tramite il sito clickeventi.it
            (di seguito, il "Sito") è <b>Susanna Manca</b>, contattabile all'indirizzo
            e-mail <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>.
          </p>
          <p>
            Ogni richiesta relativa al trattamento dei dati personali, compreso l'esercizio dei
            diritti descritti al punto 9, può essere inviata al medesimo indirizzo.
          </p>

          {/* 2 */}
          <S id="c2">2. Introduzione</S>
          <p>
            La presente informativa descrive le modalità con cui il Titolare raccoglie e utilizza
            i dati personali degli utenti del Sito, ai sensi degli articoli 13 e 14 del Regolamento
            (UE) 2016/679 ("GDPR"), nonché i diritti che l'interessato può esercitare.
          </p>
          <p>Il Sito si rivolge a tre categorie di utenti:</p>
          <ul>
            <li><b>Clienti</b>: persone che cercano professionisti per un evento e inviano richieste di preventivo;</li>
            <li><b>Professionisti</b>: persone o imprese che pubblicano il proprio profilo e ricevono richieste;</li>
            <li><b>Organizzatori</b>: soggetti che pubblicano annunci nella sezione "Annunci per eventi".</li>
          </ul>
          <p>
            Si raccomanda di leggere attentamente la presente informativa prima di utilizzare i
            servizi del Sito e di conferire dati personali attraverso le sue funzionalità.
          </p>

          {/* 3 */}
          <S id="c3">3. Quali dati personali raccogliamo</S>

          <h3>3.1 Dati dei clienti che inviano una richiesta</h3>
          <ul>
            <li><b>Dati identificativi e di contatto</b>: nome e cognome, indirizzo e-mail, numero di telefono (facoltativo);</li>
            <li><b>Dati relativi all'evento</b>: tipologia, data, orario indicativo, comune di svolgimento;</li>
            <li><b>Dati relativi alla richiesta</b>: professionista selezionato, pacchetto e servizi aggiuntivi scelti, numero di ore o di ospiti, importo calcolato, eventuali note;</li>
            <li><b>Contenuti della trattativa</b>: importi e messaggi scambiati con il professionista nell'ambito di proposte e controproposte;</li>
            <li><b>Recensioni</b>: valutazione numerica, testo della recensione e nome di battesimo, pubblicati sul profilo del professionista dopo lo svolgimento dell'evento;</li>
            <li><b>Preferenze</b>: eventuale consenso alla ricezione di comunicazioni informative.</li>
          </ul>

          <h3>3.2 Dati dei professionisti registrati</h3>
          <ul>
            <li><b>Dati di accesso</b>: indirizzo e-mail e password (conservata esclusivamente in forma cifrata e non conoscibile dal Titolare);</li>
            <li><b>Dati del profilo pubblico</b>: nome o nome d'arte, attività svolta, categoria, presentazione, comune e ulteriori zone di lavoro con relative coordinate geografiche, recapito telefonico, collegamenti a siti e profili social, fotografie e collegamenti a video;</li>
            <li><b>Dati commerciali</b>: pacchetti, servizi aggiuntivi, tariffe, fasce chilometriche, raggio massimo di spostamento;</li>
            <li><b>Dati di disponibilità</b>: giornate indicate come non disponibili;</li>
            <li><b>Dati relativi alle richieste ricevute</b> e alle candidature inviate agli annunci.</li>
          </ul>
          <p>
            I dati del profilo pubblico sono, per loro natura, <b>visibili a chiunque acceda al Sito</b>
            e possono essere indicizzati dai motori di ricerca. I recapiti diretti del professionista
            non sono pubblicati e vengono comunicati al cliente solo ad accordo concluso.
          </p>

          <h3>3.3 Dati di chi pubblica un annuncio</h3>
          <ul>
            <li>Nome o ragione sociale, indirizzo e-mail, numero di telefono (facoltativo);</li>
            <li>Contenuto dell'annuncio: titolo, descrizione, categoria, comune, date, eventuale compenso indicato.</li>
          </ul>

          <h3>3.4 Dati raccolti automaticamente</h3>
          <ul>
            <li><b>Dati tecnici di navigazione</b>: indirizzo IP, tipo di browser e dispositivo, data e ora di accesso, pagine visitate, registrati dai fornitori di infrastruttura nei log di sistema per finalità di sicurezza e continuità del servizio;</li>
            <li><b>Dati di sessione</b>: informazioni conservate nel browser per mantenere attivo l'accesso all'area riservata (si veda il punto 8).</li>
          </ul>

          <h3>3.5 Dati che non raccogliamo</h3>
          <p>
            Il Sito non raccoglie categorie particolari di dati ai sensi dell'art. 9 GDPR (quali dati
            relativi alla salute, convinzioni religiose od opinioni politiche), non richiede documenti
            di identità e non tratta dati relativi a pagamenti, non essendo attiva alcuna funzionalità
            di pagamento online.
          </p>
          <p>
            L'utente garantisce che i dati personali conferiti sono veritieri e aggiornati e si impegna
            a mantenerli tali attraverso gli strumenti messi a disposizione dal Sito. Qualora l'utente
            inserisca dati personali riferiti a terzi, dichiara di essere legittimato a comunicarli.
          </p>

          {/* 4 */}
          <S id="c4">4. Come utilizziamo i dati personali</S>

          <h3>4.1 Erogazione del servizio</h3>
          <p>
            Trattiamo i dati per consentire la ricerca dei professionisti, il calcolo del preventivo,
            l'invio della richiesta al professionista selezionato, lo svolgimento della trattativa,
            la comunicazione dell'esito e lo scambio dei recapiti ad accordo raggiunto; per consentire
            ai professionisti di pubblicare e gestire il proprio profilo e le proprie tariffe; per
            consentire la pubblicazione degli annunci e l'invio delle candidature.
          </p>
          <p>
            <b>Base giuridica</b>: esecuzione di un contratto o di misure precontrattuali adottate su
            richiesta dell'interessato (art. 6, par. 1, lett. b, GDPR).
          </p>

          <h3>4.2 Raccolta e pubblicazione delle recensioni</h3>
          <p>
            Successivamente allo svolgimento dell'evento, inviamo al cliente un invito a confermare
            l'avvenuto servizio e a lasciare una valutazione, che viene pubblicata sul profilo del
            professionista insieme al nome di battesimo del recensore. Possono recensire esclusivamente
            gli utenti che abbiano inviato una richiesta tramite il Sito.
          </p>
          <p>
            <b>Base giuridica</b>: esecuzione del contratto (art. 6, par. 1, lett. b) e legittimo
            interesse del Titolare e degli utenti a disporre di valutazioni verificate
            (art. 6, par. 1, lett. f).
          </p>

          <h3>4.3 Comunicazioni di servizio</h3>
          <p>
            Inviamo comunicazioni necessarie al funzionamento del servizio: conferma della richiesta,
            notifiche di nuova proposta, solleciti al professionista che non ha risposto, esito della
            verifica del profilo o di un annuncio, richiesta di recensione.
          </p>
          <p><b>Base giuridica</b>: esecuzione del contratto (art. 6, par. 1, lett. b).</p>

          <h3>4.4 Comunicazioni informative e promozionali</h3>
          <p>
            Previo consenso espresso, prestato mediante apposita casella non preselezionata, inviamo
            comunicazioni su novità e funzionalità del servizio. Il consenso è facoltativo, non
            condiziona l'invio della richiesta ed è revocabile in qualsiasi momento scrivendo a
            info@clickeventi.it o tramite il collegamento presente in ciascuna comunicazione.
          </p>
          <p><b>Base giuridica</b>: consenso dell'interessato (art. 6, par. 1, lett. a).</p>

          <h3>4.5 Verifica dei profili, sicurezza e prevenzione degli abusi</h3>
          <p>
            Esaminiamo i profili dei professionisti e gli annunci prima della pubblicazione, e le
            successive modifiche ai dati identificativi e alle immagini, al fine di garantire
            l'attendibilità dei contenuti pubblicati. Trattiamo inoltre i dati tecnici per prevenire
            usi impropri, tentativi di accesso non autorizzato e altre attività illecite.
          </p>
          <p><b>Base giuridica</b>: legittimo interesse del Titolare (art. 6, par. 1, lett. f).</p>

          <h3>4.6 Adempimenti di legge</h3>
          <p>
            Trattiamo i dati per adempiere agli obblighi previsti dalla normativa applicabile e per
            far valere o difendere un diritto in sede giudiziaria o stragiudiziale.
          </p>
          <p>
            <b>Base giuridica</b>: obbligo legale (art. 6, par. 1, lett. c) e legittimo interesse
            (art. 6, par. 1, lett. f).
          </p>

          {/* 5 */}
          <S id="c5">5. Da quali fonti raccogliamo i dati</S>
          <ul>
            <li><b>Direttamente dall'interessato</b>: quando compila il modulo di richiesta, si registra, completa il proprio profilo, pubblica un annuncio, si candida, risponde a una proposta o lascia una recensione;</li>
            <li><b>Da altri utenti</b>: quando un cliente indica i dati necessari alla richiesta, o quando un professionista si candida a un annuncio e i suoi dati vengono trasmessi a chi lo ha pubblicato;</li>
            <li><b>Automaticamente</b>: tramite i sistemi tecnici descritti al punto 3.4.</li>
          </ul>

          {/* 6 */}
          <S id="c6">6. A chi comunichiamo i dati</S>
          <p>I dati personali possono essere comunicati ai seguenti destinatari:</p>
          <ul>
            <li>
              <b>Al professionista selezionato</b>: i dati della richiesta e, ad accordo concluso,
              i recapiti del cliente. Reciprocamente, i recapiti del professionista sono comunicati
              al cliente.
            </li>
            <li>
              <b>A chi ha pubblicato un annuncio</b>: i dati identificativi, professionali e di
              contatto del professionista che invia una candidatura.
            </li>
            <li>
              <b>A fornitori di servizi tecnici</b>, nominati responsabili del trattamento ai sensi
              dell'art. 28 GDPR:
              <ul style={{ marginTop: 6 }}>
                <li><b>Supabase</b> — servizi di banca dati, autenticazione e archiviazione dei file (server ubicati nell'Unione Europea, Francoforte);</li>
                <li><b>Vercel</b> — servizi di hosting e distribuzione del Sito;</li>
                <li><b>Resend</b> — servizi di invio delle comunicazioni e-mail.</li>
              </ul>
            </li>
            <li>
              <b>Ad autorità pubbliche e organi giurisdizionali</b>, ove necessario per adempiere a
              obblighi di legge o per l'accertamento e la difesa di un diritto.
            </li>
          </ul>
          <p>
            I dati personali <b>non sono oggetto di cessione o vendita a terzi</b> per finalità
            commerciali e non sono utilizzati per attività di profilazione automatizzata.
          </p>

          {/* 7 */}
          <S id="c7">7. Tabella riassuntiva dei trattamenti</S>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "32%" }}>Categoria di dati</th>
                  <th style={{ width: "34%" }}>Finalità</th>
                  <th>Base giuridica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dati identificativi e di contatto (clienti)</td>
                  <td>Gestione della richiesta, trattativa, comunicazione dell'esito, scambio dei recapiti</td>
                  <td>Contratto e misure precontrattuali (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td>Dati relativi all'evento e alla richiesta</td>
                  <td>Calcolo del preventivo, verifica della disponibilità e della distanza, invio al professionista</td>
                  <td>Contratto e misure precontrattuali (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td>Dati del profilo del professionista, comprese le immagini</td>
                  <td>Pubblicazione del profilo e ricerca da parte dei clienti</td>
                  <td>Contratto (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td>Dati commerciali e di disponibilità</td>
                  <td>Determinazione del preventivo e delle date disponibili</td>
                  <td>Contratto (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td>Valutazioni e testi delle recensioni</td>
                  <td>Pubblicazione di recensioni verificate sul profilo</td>
                  <td>Contratto (art. 6.1.b) e legittimo interesse (art. 6.1.f)</td>
                </tr>
                <tr>
                  <td>Dati di chi pubblica un annuncio e delle candidature</td>
                  <td>Pubblicazione dell'annuncio e trasmissione delle candidature</td>
                  <td>Contratto e misure precontrattuali (art. 6.1.b)</td>
                </tr>
                <tr>
                  <td>Indirizzo e-mail e preferenze</td>
                  <td>Invio di comunicazioni informative e promozionali</td>
                  <td>Consenso (art. 6.1.a)</td>
                </tr>
                <tr>
                  <td>Dati del profilo e contenuti pubblicati</td>
                  <td>Verifica preventiva dei contenuti e prevenzione degli abusi</td>
                  <td>Legittimo interesse (art. 6.1.f)</td>
                </tr>
                <tr>
                  <td>Dati tecnici di navigazione e di sessione</td>
                  <td>Funzionamento del Sito, sicurezza, continuità del servizio</td>
                  <td>Legittimo interesse (art. 6.1.f)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 8 */}
          <S id="c8">8. Cookie e strumenti di tracciamento</S>
          <p>
            Il Sito utilizza <b>esclusivamente cookie e strumenti tecnici</b>, necessari a mantenere
            attiva la sessione degli utenti registrati e a conservare alcune preferenze di
            navigazione nel dispositivo dell'utente. Per tali strumenti, ai sensi dell'art. 122 del
            D.Lgs. 196/2003 e delle Linee guida del Garante, non è richiesto il consenso.
          </p>
          <p>
            Il Sito <b>non utilizza</b> cookie di profilazione, cookie pubblicitari, strumenti di
            statistica di terze parti o pixel di tracciamento, e non condivide dati di navigazione
            con reti pubblicitarie.
          </p>
          <p>
            L'utente può in ogni momento eliminare i dati conservati dal browser attraverso le
            impostazioni dello stesso; ciò potrebbe comportare la necessità di effettuare nuovamente
            l'accesso all'area riservata. Qualora in futuro vengano introdotti strumenti che
            richiedono il consenso, la presente informativa sarà aggiornata e il consenso sarà
            raccolto preventivamente.
          </p>

          {/* 9 */}
          <S id="c9">9. Diritti dell'interessato</S>
          <p>Ai sensi degli articoli 15-22 GDPR, l'interessato ha diritto di:</p>
          <ul>
            <li>ottenere conferma dell'esistenza di un trattamento e accedere ai propri dati (art. 15);</li>
            <li>ottenere la rettifica dei dati inesatti o l'integrazione di quelli incompleti (art. 16);</li>
            <li>ottenere la cancellazione dei dati nei casi previsti (art. 17);</li>
            <li>ottenere la limitazione del trattamento (art. 18);</li>
            <li>ricevere i dati in formato strutturato e di uso comune e trasmetterli ad altro titolare (art. 20);</li>
            <li>opporsi al trattamento fondato sul legittimo interesse (art. 21);</li>
            <li>revocare in qualsiasi momento il consenso prestato, senza che ciò pregiudichi la liceità del trattamento effettuato prima della revoca.</li>
          </ul>
          <div className="pv-box">
            <p>
              I diritti possono essere esercitati scrivendo a{" "}
              <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>. Il Titolare risponde
              senza ingiustificato ritardo e, comunque, entro un mese dal ricevimento della
              richiesta, prorogabile di due mesi in caso di particolare complessità.
              L'interessato ha inoltre diritto di proporre reclamo al Garante per la protezione dei
              dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">garanteprivacy.it</a>)
              o all'autorità di controllo dello Stato di residenza.
            </p>
          </div>
          <p>
            Si precisa che la cancellazione del profilo di un professionista comporta la rimozione
            dei relativi contenuti pubblici; le recensioni ricevute potranno essere conservate in
            forma anonimizzata ove necessario a garantire l'attendibilità delle valutazioni
            complessive.
          </p>

          {/* 10 */}
          <S id="c10">10. Trasferimenti internazionali di dati</S>
          <p>
            I dati archiviati nella banca dati del Sito sono ospitati su server ubicati
            nell'<b>Unione Europea</b> (Francoforte, Germania).
          </p>
          <p>
            Alcuni fornitori di servizi tecnici sono tuttavia società con sede negli Stati Uniti
            d'America e, per l'erogazione dei rispettivi servizi, possono trattare dati al di fuori
            dello Spazio economico europeo. In tali casi il trasferimento avviene sulla base delle
            garanzie previste dal Capo V del GDPR, ossia le clausole contrattuali tipo adottate dalla
            Commissione europea e/o l'adesione del fornitore al <i>Data Privacy Framework</i> UE-USA,
            unitamente a misure supplementari di sicurezza.
          </p>
          <p>
            L'interessato può richiedere informazioni sulle garanzie adottate scrivendo a
            info@clickeventi.it.
          </p>

          {/* 11 */}
          <S id="c11">11. Per quanto tempo conserviamo i dati</S>
          <ul>
            <li><b>Richieste di preventivo e relative trattative</b>: 24 mesi dall'invio, salvo diverso termine necessario alla difesa di un diritto;</li>
            <li><b>Profili dei professionisti</b>: per tutta la durata del rapporto e fino alla richiesta di cancellazione;</li>
            <li><b>Recensioni pubblicate</b>: fino alla permanenza del profilo del professionista sul Sito;</li>
            <li><b>Annunci e candidature</b>: 24 mesi dalla pubblicazione;</li>
            <li><b>Dati trattati sulla base del consenso</b>: fino alla revoca dello stesso;</li>
            <li><b>Dati tecnici e registri di sistema</b>: per il tempo strettamente necessario alle finalità di sicurezza, secondo le politiche dei fornitori.</li>
          </ul>
          <p>
            Decorsi tali termini i dati sono cancellati o resi anonimi, fatti salvi gli obblighi di
            conservazione previsti dalla legge. L'interessato può comunque richiederne la
            cancellazione anticipata ai sensi del punto 9.
          </p>

          {/* 12 */}
          <S id="c12">12. Come proteggiamo i dati</S>
          <p>
            Il Titolare adotta misure tecniche e organizzative adeguate a garantire un livello di
            sicurezza adeguato al rischio, tra cui: cifratura delle comunicazioni tramite protocollo
            HTTPS, conservazione delle password mediante funzioni di hashing non reversibili,
            regole di accesso ai dati differenziate per tipologia di utente, limitazione dell'accesso
            ai dati identificativi ai soli soggetti coinvolti nella specifica richiesta, copie di
            sicurezza periodiche e registrazione degli accessi.
          </p>

          {/* 13 */}
          <S id="c13">13. Dati dei minori</S>
          <p>
            I servizi del Sito sono riservati a soggetti maggiorenni. Il Titolare non raccoglie
            consapevolmente dati personali di minori di età inferiore a 14 anni; qualora venga
            rilevata la presenza di tali dati, essi saranno cancellati senza ingiustificato ritardo.
          </p>
          <p>
            L'utente che inserisca dati o immagini riferiti a minori dichiara di essere titolare
            della responsabilità genitoriale o di disporre del consenso di chi la esercita.
          </p>

          {/* 14 */}
          <S id="c14">14. Modifiche all'informativa</S>
          <p>
            Il Titolare può aggiornare la presente informativa, in particolare a seguito di modifiche
            normative o di variazioni nelle modalità di trattamento. La data indicata in apertura
            individua sempre la versione vigente. In caso di modifiche sostanziali, gli utenti
            registrati saranno informati via e-mail.
          </p>

          <p style={{ marginTop: 30 }}>
            <a href="/">← Torna al sito</a>
          </p>
        </div>
      </div>
    </div>
  );
}
