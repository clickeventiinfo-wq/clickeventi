import { Shield } from "lucide-react";

/* ============================================================
   CLICK EVENTI — Informativa sulla privacy
   Redatta ai sensi degli artt. 13-14 GDPR.
   ⚠️ Testo predisposto per la revisione di un legale: alcune
   dichiarazioni (ruoli e garanzie dei fornitori) vanno verificate
   sui DPA effettivamente sottoscritti.
   ============================================================ */

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
    :root{--bg2:#FAF9F7;--ink:#23203A;--accent:#8B6EF3;--grigio:#6E6A80;--linea:#ECE9E2}
    *{box-sizing:border-box;margin:0;padding:0}
    .pv-root{font-family:'Work Sans',system-ui,sans-serif;background:var(--bg2);color:var(--ink);min-height:100vh;-webkit-font-smoothing:antialiased}
    .pv-head{background:#fff;border-bottom:1px solid var(--linea);height:60px;display:flex;align-items:center}
    .pv-wrap{max-width:780px;margin:0 auto;padding:0 20px}
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
    .pv-tab{width:100%;border-collapse:collapse;margin:14px 0 18px;font-size:13px}
    .pv-tab th{text-align:left;background:var(--bg2);padding:10px 11px;font-weight:700;border-bottom:1px solid var(--linea);vertical-align:top}
    .pv-tab td{padding:10px 11px;border-bottom:1px solid var(--linea);vertical-align:top;line-height:1.55;color:#3A3552}
    .pv-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
    @media(max-width:600px){.pv-card{padding:24px 20px}.pv-tab{font-size:12px;min-width:540px}}
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
              <li><a href="#c2">Introduzione e ruoli</a></li>
              <li><a href="#c3">Quali dati personali raccogliamo</a></li>
              <li><a href="#c4">Dati obbligatori e facoltativi</a></li>
              <li><a href="#c5">Come utilizziamo i dati personali</a></li>
              <li><a href="#c6">Da quali fonti raccogliamo i dati</a></li>
              <li><a href="#c7">A chi comunichiamo i dati</a></li>
              <li><a href="#c8">Tabella riassuntiva dei trattamenti</a></li>
              <li><a href="#c9">Cookie e strumenti di archiviazione</a></li>
              <li><a href="#c10">Trasferimenti di dati fuori dallo SEE</a></li>
              <li><a href="#c11">Processi decisionali automatizzati</a></li>
              <li><a href="#c12">Diritti dell'interessato</a></li>
              <li><a href="#c13">Per quanto tempo conserviamo i dati</a></li>
              <li><a href="#c14">Come proteggiamo i dati</a></li>
              <li><a href="#c15">Minori</a></li>
              <li><a href="#c16">Modifiche all'informativa</a></li>
            </ol>
          </div>

          {/* 1 */}
          <S id="c1">1. Titolare del trattamento e contatti</S>
          <p>
            Il Titolare del trattamento dei dati personali raccolti tramite il sito clickeventi.it
            (di seguito, il "Sito") è <b>Susanna Manca</b>, contattabile all'indirizzo e-mail{" "}
            <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>, casella regolarmente
            presidiata e utilizzata anche per l'esercizio dei diritti di cui al punto 12.
          </p>
          <p>
            Il Titolare non ha nominato un Responsabile della protezione dei dati, non ricorrendo
            i presupposti di cui all'art. 37 GDPR.
          </p>

          {/* 2 */}
          <S id="c2">2. Introduzione e ruoli</S>
          <p>
            La presente informativa descrive le modalità con cui il Titolare raccoglie e utilizza i
            dati personali degli utenti del Sito, ai sensi degli artt. 13 e 14 del Regolamento (UE)
            2016/679 ("GDPR").
          </p>
          <p>Il Sito si rivolge a tre categorie di utenti:</p>
          <ul>
            <li><b>Clienti</b>: persone che cercano professionisti per un evento e inviano richieste di preventivo;</li>
            <li><b>Professionisti</b>: persone fisiche o imprese che pubblicano il proprio profilo e ricevono richieste;</li>
            <li><b>Organizzatori</b>: soggetti che pubblicano annunci nella sezione "Annunci per eventi".</li>
          </ul>

          <h3>2.1 Ruolo del Titolare e autonomia delle parti</h3>
          <p>
            Click Eventi opera quale piattaforma di intermediazione. Il Titolare agisce in qualità di
            titolare autonomo del trattamento per la gestione del Sito, degli account, della
            pubblicazione dei profili e degli annunci, delle richieste, delle trattative, delle
            recensioni, della sicurezza e delle comunicazioni proprie.
          </p>
          <div className="pv-box">
            <p>
              Una volta che i dati di contatto sono comunicati fra cliente e professionista, ovvero
              fra professionista e organizzatore, <b>ciascuna parte tratta tali dati in qualità di
              autonomo titolare</b> per le proprie finalità e sotto la propria responsabilità. Il
              Titolare non risponde dei trattamenti successivamente effettuati dalle parti e non
              esercita alcun controllo sugli accordi conclusi direttamente fra le stesse.
            </p>
          </div>

          {/* 3 */}
          <S id="c3">3. Quali dati personali raccogliamo</S>

          <h3>3.1 Clienti che inviano una richiesta</h3>
          <ul>
            <li><b>Identificativi e di contatto</b>: nome e cognome, indirizzo e-mail, numero di telefono;</li>
            <li><b>Relativi all'evento</b>: tipologia, data, orario indicativo, comune di svolgimento;</li>
            <li><b>Relativi alla richiesta</b>: professionista selezionato, pacchetto e servizi aggiuntivi, numero di ore o di ospiti, importo calcolato, note in testo libero;</li>
            <li><b>Trattativa</b>: importi proposti e messaggi in testo libero scambiati con il professionista;</li>
            <li><b>Recensioni</b>: valutazione numerica, testo in forma libera e nome di battesimo, pubblicati sul profilo del professionista;</li>
            <li><b>Preferenze</b>: eventuale consenso alle comunicazioni informative.</li>
          </ul>

          <h3>3.2 Professionisti registrati</h3>
          <ul>
            <li><b>Accesso</b>: indirizzo e-mail e password;</li>
            <li><b>Profilo pubblico</b>: nome o nome d'arte, attività svolta, categoria, presentazione, comune e ulteriori zone di lavoro, recapito telefonico, collegamenti a siti e profili social, fotografie, collegamenti a video;</li>
            <li><b>Commerciali</b>: pacchetti, servizi aggiuntivi, tariffe, fasce chilometriche, raggio massimo di spostamento;</li>
            <li><b>Disponibilità</b>: giornate indicate come non disponibili;</li>
            <li><b>Richieste ricevute</b> e candidature inviate agli annunci.</li>
          </ul>
          <p>
            Le <b>coordinate geografiche</b> associate al profilo sono quelle convenzionali del comune
            indicato, ricavate da un elenco pubblico dei comuni italiani: non si tratta di dati di
            geolocalizzazione precisa e sono utilizzate esclusivamente per calcolare la distanza
            approssimativa fra la zona del professionista e il comune dell'evento.
          </p>
          <div className="pv-box">
            <p>
              I dati indicati come "profilo pubblico" sono, per loro natura, <b>visibili a chiunque
              acceda al Sito</b> e possono essere indicizzati dai motori di ricerca. Il recapito
              telefonico e l'indirizzo e-mail del professionista <b>non sono pubblicati</b>: sono
              comunicati al cliente unicamente nel momento indicato al punto 7.1.
            </p>
          </div>

          <h3>3.3 Chi pubblica un annuncio</h3>
          <ul>
            <li>Nome o ragione sociale, indirizzo e-mail, numero di telefono;</li>
            <li>Contenuto dell'annuncio: titolo, descrizione in testo libero, categoria, comune, date, eventuale compenso indicato.</li>
          </ul>

          <h3>3.4 Dati raccolti automaticamente</h3>
          <ul>
            <li><b>Dati tecnici</b>: indirizzo IP, tipo di browser e di dispositivo, data e ora di accesso, pagine richieste, registrati nei log di sistema dai fornitori di infrastruttura per finalità di sicurezza, diagnostica e continuità del servizio;</li>
            <li><b>Dati di sessione</b>: informazioni conservate nella memoria locale del browser per mantenere attivo l'accesso all'area riservata (punto 9).</li>
          </ul>

          <h3>3.5 Categorie particolari di dati</h3>
          <p>
            Il Sito <b>non richiede né raccoglie intenzionalmente</b> categorie particolari di dati
            personali ai sensi dell'art. 9 GDPR. Poiché diversi campi sono in forma libera (note della
            richiesta, messaggi della trattativa, recensioni, presentazioni, descrizioni degli annunci,
            immagini), gli utenti sono invitati a <b>non inserire</b> informazioni relative in
            particolare a salute, convinzioni religiose o filosofiche, opinioni politiche, origine
            razziale o etnica, appartenenza sindacale, vita o orientamento sessuale.
          </p>
          <p>
            Qualora tali dati siano conferiti volontariamente, il Titolare li tratterà esclusivamente
            nella misura necessaria a gestire la richiesta o il contenuto cui si riferiscono e, ove
            non necessari, potrà procedere alla loro cancellazione o oscuramento.
          </p>
          <p>
            Il Sito non richiede documenti di identità e non tratta dati relativi a pagamenti, non
            essendo attiva alcuna funzionalità di pagamento online.
          </p>
          <p>
            L'utente garantisce che i dati conferiti sono veritieri e aggiornati. Qualora inserisca
            dati personali riferiti a terzi, dichiara di essere legittimato a comunicarli.
          </p>

          {/* 4 */}
          <S id="c4">4. Dati obbligatori e facoltativi</S>
          <p>
            Il conferimento dei dati contrassegnati come obbligatori nei moduli del Sito è necessario
            per utilizzare la funzionalità cui si riferiscono: il mancato conferimento impedisce, in
            tutto o in parte, l'erogazione del relativo servizio. Il conferimento degli altri dati è
            facoltativo e non pregiudica l'accesso alle funzionalità essenziali.
          </p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr><th style={{ width: "34%" }}>Dato</th><th style={{ width: "22%" }}>Conferimento</th><th>Conseguenza del mancato conferimento</th></tr>
              </thead>
              <tbody>
                <tr><td>Nome del cliente</td><td>Obbligatorio</td><td>Non è possibile inviare la richiesta</td></tr>
                <tr><td>E-mail del cliente</td><td>Obbligatorio</td><td>Non è possibile inviare la richiesta né ricevere riscontri e proposte</td></tr>
                <tr><td>Telefono del cliente</td><td>Facoltativo</td><td>Nessuna: consente al professionista di contattare anche telefonicamente</td></tr>
                <tr><td>Dati dell'evento (tipo, data, comune)</td><td>Necessari</td><td>Non è possibile calcolare il preventivo né verificare la disponibilità</td></tr>
                <tr><td>Note e messaggi della trattativa</td><td>Facoltativi</td><td>Nessuna</td></tr>
                <tr><td>Consenso alle comunicazioni informative</td><td>Facoltativo</td><td>Nessuna: non vengono inviate comunicazioni non necessarie al servizio</td></tr>
                <tr><td>E-mail e password del professionista</td><td>Obbligatori</td><td>Non è possibile creare l'account</td></tr>
                <tr><td>Nome, attività, categoria, comune del professionista</td><td>Obbligatori</td><td>Il profilo non può essere pubblicato</td></tr>
                <tr><td>Almeno una fotografia</td><td>Obbligatoria</td><td>Il profilo non può essere sottoposto a verifica</td></tr>
                <tr><td>Presentazione, collegamenti social e video, ulteriori fotografie</td><td>Facoltativi</td><td>Nessuna: il profilo resta pubblicabile</td></tr>
                <tr><td>Nome, e-mail e contenuto dell'annuncio</td><td>Obbligatori</td><td>L'annuncio non può essere pubblicato</td></tr>
              </tbody>
            </table>
          </div>

          {/* 5 */}
          <S id="c5">5. Come utilizziamo i dati personali</S>

          <h3>5.1 Erogazione del servizio</h3>
          <p>
            Ricerca dei professionisti, calcolo del preventivo, verifica della disponibilità e della
            distanza, invio della richiesta al professionista selezionato, svolgimento della
            trattativa, comunicazione dell'esito, scambio dei recapiti ad accordo raggiunto;
            creazione e gestione degli account; pubblicazione degli annunci e trasmissione delle
            candidature.<br />
            <b>Base giuridica</b>: esecuzione di un contratto o di misure precontrattuali adottate su
            richiesta dell'interessato (art. 6.1.b).
          </p>

          <h3>5.2 Pubblicazione del profilo del professionista</h3>
          <p>
            I dati indispensabili alla pubblicazione (nome, attività, categoria, zona, almeno una
            fotografia, listino) sono trattati per l'esecuzione del servizio richiesto dal
            professionista, che consiste nella pubblicazione del profilo.<br />
            <b>Base giuridica</b>: esecuzione del contratto (art. 6.1.b).
          </p>
          <p>
            I contenuti ulteriori e facoltativi che il professionista sceglie di pubblicare
            (presentazione, fotografie aggiuntive, collegamenti a siti, profili social e video) sono
            trattati in quanto volontariamente resi pubblici dall'interessato e possono essere da
            questi rimossi in qualsiasi momento dal proprio pannello.<br />
            <b>Base giuridica</b>: esecuzione del contratto (art. 6.1.b) e, per i contenuti
            facoltativi, manifestazione di volontà dell'interessato che li rende pubblici.
          </p>

          <h3>5.3 Recensioni</h3>
          <ul>
            <li>
              <b>Invito a recensire</b> inviato al cliente dopo la data dell'evento: legittimo
              interesse del Titolare a raccogliere riscontri sul servizio intermediato (art. 6.1.f).
            </li>
            <li>
              <b>Raccolta della recensione</b>: la recensione è resa volontariamente
              dall'interessato, che decide se e cosa scrivere (art. 6.1.b e manifestazione di volontà
              dell'interessato).
            </li>
            <li>
              <b>Pubblicazione della valutazione, del testo e del nome di battesimo</b>: legittimo
              interesse del Titolare, dei professionisti e degli altri utenti a disporre di
              valutazioni verificate e attribuibili (art. 6.1.f). Il Titolare ha valutato che tale
              interesse non sia sovrastato dai diritti dell'interessato, considerato che viene
              pubblicato il solo nome di battesimo e che l'interessato può chiederne in ogni momento
              la rimozione o l'anonimizzazione.
            </li>
            <li>
              <b>Conservazione della recensione in forma anonimizzata</b> in caso di cancellazione
              del profilo recensito o del recensore: legittimo interesse all'attendibilità delle
              valutazioni complessive (art. 6.1.f).
            </li>
          </ul>
          <p>
            Possono recensire esclusivamente gli utenti che abbiano inviato una richiesta tramite il
            Sito e ricevuto il relativo collegamento personale.
          </p>

          <h3>5.4 Comunicazioni di servizio</h3>
          <p>
            Conferma della richiesta, notifiche di nuova proposta, solleciti al professionista che non
            ha risposto, esito della verifica del profilo o dell'annuncio, invito a recensire.<br />
            <b>Base giuridica</b>: esecuzione del contratto (art. 6.1.b).
          </p>

          <h3>5.5 Comunicazioni informative e promozionali</h3>
          <p>
            Previo consenso espresso, prestato mediante casella non preselezionata e distinta
            dall'accettazione dell'informativa, inviamo comunicazioni su novità e funzionalità del
            servizio. Il consenso è facoltativo, non condiziona l'invio della richiesta ed è
            revocabile in qualsiasi momento.<br />
            <b>Base giuridica</b>: consenso (art. 6.1.a).
          </p>

          <h3>5.6 Verifica dei contenuti, sicurezza e prevenzione degli abusi</h3>
          <p>
            Esame dei profili e degli annunci prima della pubblicazione e delle successive modifiche
            ai dati identificativi e alle immagini; trattamento dei dati tecnici per prevenire usi
            impropri, tentativi di accesso non autorizzato e attività illecite.<br />
            <b>Base giuridica</b>: legittimo interesse del Titolare e degli utenti all'attendibilità e
            alla sicurezza della piattaforma (art. 6.1.f).
          </p>

          <h3>5.7 Adempimenti di legge e tutela dei diritti</h3>
          <p>
            <b>Base giuridica</b>: obbligo legale (art. 6.1.c) e legittimo interesse all'accertamento,
            esercizio o difesa di un diritto (art. 6.1.f).
          </p>

          {/* 6 */}
          <S id="c6">6. Da quali fonti raccogliamo i dati</S>
          <ul>
            <li><b>Direttamente dall'interessato</b>: compilazione dei moduli, registrazione, completamento del profilo, pubblicazione di un annuncio, candidatura, risposta a una proposta, recensione;</li>
            <li><b>Da altri utenti</b>: quando un cliente indica i dati necessari alla richiesta, o quando i dati di un professionista che si candida sono trasmessi a chi ha pubblicato l'annuncio;</li>
            <li><b>Automaticamente</b>: tramite i sistemi tecnici descritti al punto 3.4.</li>
          </ul>

          {/* 7 */}
          <S id="c7">7. A chi comunichiamo i dati</S>

          <h3>7.1 Fra utenti del Sito</h3>
          <ul>
            <li>
              <b>Al professionista destinatario</b>: i dati della richiesta e i messaggi della
              trattativa. Nome, e-mail ed eventuale telefono del cliente sono comunicati al
              professionista <b>nel momento in cui la richiesta assume lo stato "accettata"</b>, ossia
              quando il professionista accetta la richiesta oppure il cliente accetta una proposta del
              professionista. Contestualmente, e-mail e telefono del professionista sono comunicati al
              cliente.
            </li>
            <li>
              <b>A chi ha pubblicato un annuncio</b>: al momento dell'invio della candidatura, i dati
              identificativi, professionali e di contatto del professionista candidato.
            </li>
          </ul>

          <h3>7.2 A fornitori di servizi tecnici</h3>
          <p>
            Il Titolare si avvale dei seguenti fornitori, con i quali sono in essere i rispettivi
            accordi sul trattamento dei dati:
          </p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>Fornitore</th>
                  <th style={{ width: "32%" }}>Dati e servizio</th>
                  <th style={{ width: "24%" }}>Localizzazione</th>
                  <th>Ruolo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Supabase</b></td>
                  <td>Banca dati, autenticazione, archiviazione delle fotografie</td>
                  <td>Archiviazione primaria nella regione dell'Unione Europea (Francoforte); possibile ricorso a sub-responsabili anche extra-SEE</td>
                  <td>Responsabile del trattamento</td>
                </tr>
                <tr>
                  <td><b>Vercel</b></td>
                  <td>Hosting e distribuzione del Sito; dati tecnici di connessione</td>
                  <td>Rete di distribuzione con nodi in più Paesi, Stati Uniti inclusi</td>
                  <td>Responsabile del trattamento per i dati del cliente; titolare autonomo per determinati dati generati dal servizio</td>
                </tr>
                <tr>
                  <td><b>Resend</b></td>
                  <td>Invio delle comunicazioni e-mail: indirizzo del destinatario, contenuto e registri di consegna</td>
                  <td>Stati Uniti; possibile ricorso a sub-responsabili</td>
                  <td>Responsabile del trattamento</td>
                </tr>
                <tr>
                  <td><b>Google Fonts</b></td>
                  <td>Fornitura dei caratteri tipografici. La visualizzazione delle pagine comporta una richiesta ai server del fornitore, che riceve l'indirizzo IP del visitatore</td>
                  <td>Stati Uniti</td>
                  <td>Titolare autonomo per i dati di connessione ricevuti</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>7.3 Altri destinatari</h3>
          <p>
            Autorità pubbliche, forze dell'ordine e organi giurisdizionali, ove necessario per
            adempiere a obblighi di legge o per l'accertamento e la difesa di un diritto.
          </p>
          <p>
            I dati personali <b>non sono ceduti né venduti a terzi</b> per finalità commerciali e non
            sono comunicati a reti pubblicitarie.
          </p>

          {/* 8 */}
          <S id="c8">8. Tabella riassuntiva dei trattamenti</S>
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
                <tr><td>Identificativi e di contatto (clienti)</td><td>Gestione della richiesta, trattativa, esito, scambio dei recapiti</td><td>Art. 6.1.b</td></tr>
                <tr><td>Dati dell'evento e della richiesta</td><td>Calcolo del preventivo, verifica di disponibilità e distanza</td><td>Art. 6.1.b</td></tr>
                <tr><td>Dati indispensabili del profilo professionista</td><td>Pubblicazione del profilo e ricerca da parte dei clienti</td><td>Art. 6.1.b</td></tr>
                <tr><td>Contenuti facoltativi del profilo (presentazione, foto ulteriori, link)</td><td>Arricchimento del profilo pubblico</td><td>Art. 6.1.b e volontà dell'interessato di renderli pubblici</td></tr>
                <tr><td>Dati commerciali e di disponibilità</td><td>Determinazione del preventivo e delle date disponibili</td><td>Art. 6.1.b</td></tr>
                <tr><td>Valutazioni e testi delle recensioni</td><td>Raccolta e pubblicazione di recensioni verificate</td><td>Art. 6.1.b e 6.1.f (punto 5.3)</td></tr>
                <tr><td>Dati degli annunci e delle candidature</td><td>Pubblicazione e trasmissione al destinatario</td><td>Art. 6.1.b</td></tr>
                <tr><td>Indirizzo e-mail e preferenze</td><td>Comunicazioni informative e promozionali</td><td>Art. 6.1.a</td></tr>
                <tr><td>Contenuti pubblicati e dati del profilo</td><td>Verifica preventiva e prevenzione degli abusi</td><td>Art. 6.1.f</td></tr>
                <tr><td>Dati tecnici e di sessione</td><td>Funzionamento del Sito, sicurezza, continuità del servizio</td><td>Art. 6.1.f</td></tr>
              </tbody>
            </table>
          </div>

          {/* 9 */}
          <S id="c9">9. Cookie e strumenti di archiviazione</S>
          <p>
            Il Sito utilizza esclusivamente strumenti <b>tecnici e strettamente necessari</b>. Per tali
            strumenti, ai sensi dell'art. 122 del D.Lgs. 196/2003 e delle Linee guida del Garante per
            la protezione dei dati personali, non è richiesto il consenso dell'utente.
          </p>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Strumento</th>
                  <th style={{ width: "20%" }}>Tipo</th>
                  <th style={{ width: "28%" }}>Finalità</th>
                  <th>Durata</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Token di sessione dell'area riservata (memoria locale del browser, gestita dal servizio di autenticazione)</td>
                  <td>Tecnico, prima parte</td>
                  <td>Mantenere l'utente autenticato fra una pagina e l'altra</td>
                  <td>Fino alla disconnessione o alla scadenza della sessione</td>
                </tr>
                <tr>
                  <td>Codice temporaneo di verifica dell'accesso</td>
                  <td>Tecnico, prima parte</td>
                  <td>Completare le procedure di accesso e di reimpostazione della password</td>
                  <td>Durata della singola procedura</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Il Sito <b>non utilizza</b> cookie di profilazione o pubblicitari, strumenti di statistica
            di terze parti, pixel di tracciamento, social plugin, mappe o video incorporati.
          </p>
          <p>
            Come indicato al punto 7.2, le pagine caricano i caratteri tipografici da un fornitore
            esterno: tale richiesta comporta la trasmissione dell'indirizzo IP del visitatore, senza
            installazione di cookie.
          </p>
          <p>
            L'utente può eliminare in ogni momento i dati conservati dal browser tramite le relative
            impostazioni; ciò comporterà la necessità di effettuare nuovamente l'accesso. Qualora in
            futuro siano introdotti strumenti che richiedono il consenso, la presente informativa sarà
            aggiornata e il consenso raccolto preventivamente.
          </p>

          {/* 10 */}
          <S id="c10">10. Trasferimenti di dati fuori dallo Spazio economico europeo</S>
          <p>
            L'archiviazione primaria dei dati della piattaforma avviene su infrastruttura ubicata
            nell'Unione Europea. Alcuni fornitori indicati al punto 7.2 hanno sede negli Stati Uniti
            d'America o si avvalgono di sub-responsabili situati al di fuori dello SEE: per tali
            trasferimenti il Titolare si avvale delle garanzie previste dal Capo V del GDPR, in
            particolare le <b>clausole contrattuali tipo</b> adottate dalla Commissione europea e,
            ove il fornitore vi aderisca, la <b>decisione di adeguatezza relativa al Data Privacy
            Framework UE-USA</b>.
          </p>
          <p>
            L'interessato può richiedere informazioni sulle garanzie in concreto applicate a ciascun
            fornitore, e copia delle stesse, scrivendo a{" "}
            <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>.
          </p>

          {/* 11 */}
          <S id="c11">11. Processi decisionali automatizzati</S>
          <p>
            Il Sito ordina i risultati di ricerca secondo criteri oggettivi e uguali per tutti gli
            utenti: corrispondenza con il tipo di evento e con i termini cercati, disponibilità nella
            data indicata, distanza dal comune dell'evento, prezzo. Il preventivo è calcolato
            applicando il listino pubblicato dal professionista e le sue fasce chilometriche.
          </p>
          <p>
            Tali elaborazioni non comportano la costruzione di profili individuali degli utenti né la
            personalizzazione dei risultati sulla base del comportamento di navigazione. Non vengono
            effettuati processi decisionali basati unicamente su trattamenti automatizzati che
            producano effetti giuridici o incidano in modo analogamente significativo
            sull'interessato ai sensi dell'art. 22 GDPR.
          </p>

          {/* 12 */}
          <S id="c12">12. Diritti dell'interessato</S>
          <p>Ai sensi degli artt. 15-22 GDPR, l'interessato ha diritto di:</p>
          <ul>
            <li>accedere ai propri dati e ottenerne copia (art. 15);</li>
            <li>ottenere la rettifica dei dati inesatti o l'integrazione di quelli incompleti (art. 16);</li>
            <li>ottenere la cancellazione dei dati nei casi previsti (art. 17);</li>
            <li>ottenere la limitazione del trattamento (art. 18);</li>
            <li>ricevere i dati in formato strutturato e trasmetterli ad altro titolare (art. 20);</li>
            <li>opporsi al trattamento fondato sul legittimo interesse, per motivi connessi alla propria situazione particolare (art. 21.1);</li>
            <li><b>opporsi in qualsiasi momento, senza necessità di motivazione, al trattamento per finalità di marketing diretto</b> (art. 21.2);</li>
            <li>revocare il consenso prestato, senza che ciò pregiudichi la liceità del trattamento effettuato prima della revoca (art. 7.3).</li>
          </ul>
          <div className="pv-box">
            <p>
              I diritti si esercitano scrivendo a{" "}
              <a href="mailto:info@clickeventi.it">info@clickeventi.it</a>. Il Titolare risponde senza
              ingiustificato ritardo e comunque entro un mese, prorogabile di due mesi in caso di
              particolare complessità. L'interessato ha inoltre diritto di proporre reclamo al Garante
              per la protezione dei dati personali
              (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">garanteprivacy.it</a>)
              o all'autorità di controllo dello Stato di residenza.
            </p>
          </div>
          <p>
            La cancellazione del profilo di un professionista comporta la rimozione dei relativi
            contenuti pubblici. Le recensioni ricevute possono essere conservate in forma anonimizzata
            ove necessario a garantire l'attendibilità delle valutazioni complessive; l'interessato può
            opporsi a tale conservazione ai sensi dell'art. 21 GDPR.
          </p>

          {/* 13 */}
          <S id="c13">13. Per quanto tempo conserviamo i dati</S>
          <div className="pv-scroll">
            <table className="pv-tab">
              <thead>
                <tr><th style={{ width: "42%" }}>Dati</th><th>Periodo di conservazione</th></tr>
              </thead>
              <tbody>
                <tr><td>Richieste di preventivo e trattative concluse</td><td>24 mesi dalla conclusione</td></tr>
                <tr><td>Account e profili dei professionisti</td><td>Per la durata del rapporto; in caso di inattività dell'account protratta per 24 mesi, il Titolare informa l'interessato e procede alla cancellazione in assenza di riscontro</td></tr>
                <tr><td>Recensioni pubblicate</td><td>Fino alla permanenza del profilo recensito sul Sito; successivamente, in forma anonimizzata</td></tr>
                <tr><td>Annunci e candidature</td><td>24 mesi dalla pubblicazione</td></tr>
                <tr><td>Dati trattati sulla base del consenso</td><td>Fino alla revoca del consenso, che determina la cessazione del trattamento fondato su tale base, salva la conservazione dei dati per i quali sussista un'altra base giuridica</td></tr>
                <tr><td>Registri tecnici di sistema</td><td>Per il tempo necessario alle finalità di sicurezza, secondo le politiche dei fornitori</td></tr>
                <tr><td>Copie di sicurezza</td><td>Le cancellazioni si riflettono sulle copie di sicurezza entro il relativo ciclo di rotazione, al termine del quale i dati sono definitivamente rimossi</td></tr>
                <tr><td>Dati necessari all'esercizio o alla difesa di un diritto</td><td>Per il periodo di prescrizione applicabile, salvo ulteriori esigenze derivanti da procedimenti già instaurati</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Decorsi tali termini i dati sono cancellati o resi anonimi, fatti salvi gli obblighi di
            conservazione previsti dalla legge. L'interessato può richiederne la cancellazione
            anticipata ai sensi del punto 12.
          </p>

          {/* 14 */}
          <S id="c14">14. Come proteggiamo i dati</S>
          <p>
            Il Titolare adotta misure tecniche e organizzative adeguate al rischio, fra cui:
          </p>
          <ul>
            <li>trasmissione dei dati tramite protocollo cifrato HTTPS;</li>
            <li>gestione delle credenziali affidata al servizio di autenticazione del fornitore, che memorizza le password mediante funzioni crittografiche di hashing: le password non sono conservate in chiaro e non sono accessibili al Titolare;</li>
            <li>regole di accesso ai dati applicate a livello di banca dati, che limitano la visibilità dei dati di ciascuna richiesta al professionista destinatario e impediscono agli utenti di accedere ai dati di altri utenti;</li>
            <li>controlli che impediscono ai professionisti di modificare autonomamente lo stato di approvazione del profilo, le valutazioni ricevute e i contatti altrui;</li>
            <li>verifica preventiva dei contenuti pubblicati;</li>
            <li>copie di sicurezza periodiche della banca dati.</li>
          </ul>
          <p>
            Il Titolare, in qualità di amministratore della piattaforma, può accedere ai dati
            necessari alla gestione del servizio e all'assistenza agli utenti.
          </p>

          {/* 15 */}
          <S id="c15">15. Minori</S>
          <p>
            Il Sito e i relativi servizi sono destinati a <b>persone maggiorenni</b>: non è consentito
            registrarsi, inviare richieste, pubblicare annunci o candidarsi a chi non abbia compiuto
            18 anni.
          </p>
          <p>
            Tale limitazione riguarda l'utilizzo del servizio in qualità di utente e non impedisce che
            un evento riguardi minori o che un minore sia menzionato o rappresentato nei contenuti
            conferiti: in tal caso l'utente che inserisce i dati dichiara di essere titolare della
            responsabilità genitoriale o di disporre del consenso di chi la esercita.
          </p>
          <p>
            Qualora il Titolare rilevi che un account sia stato creato da un minore, procede alla
            sospensione e alla cancellazione dei relativi dati senza ingiustificato ritardo.
          </p>

          {/* 16 */}
          <S id="c16">16. Modifiche all'informativa</S>
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
