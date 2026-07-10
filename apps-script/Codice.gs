/**
* STRADILAB – Riepilogo Ore Formazione Docenti
* Webapp Google Apps Script collegata al foglio:
* https://docs.google.com/spreadsheets/d/1GWdSqqLUbqzzQjPkX9k9RYdLQhK--DdaoapEaiKs5yc/edit
*
* Funzioni:
*  - getTrainingHours(cognome): cerca i corsi del docente e restituisce
*    sia il totale ore sia l'elenco dettagliato dei corsi.
*  - sendTrainingPdf(cognome): genera un PDF istituzionale con l'elenco
*    dei corsi e il totale ore, e lo invia via email al docente.
*/


// Logo istituzionale in base64 (JPEG), usato nell'intestazione del PDF.
var LOGO_BASE64 = "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";


// Soglia minima ore triennio (DM 14/2024 / normativa formazione docenti).
var ORE_MINIME_TRIENNIO = 60;


// ── Vista Dirigente: soglie semaforo (ore totali triennio) ──
var SOGLIA_VERDE  = 60;   // PIÙ di 60 ore  -> pallino verde
var SOGLIA_GIALLO = 35;   // ALMENO 35 ore  -> pallino giallo; sotto -> rosso

// Account abilitati alla Vista Dirigente (in minuscolo).
// Aggiungi o togli indirizzi qui, uno per riga.
var ACCOUNT_DIRIGENTE = [
  "dirigente@istitutostradivari.it",
  "nuzzo@istitutostradivari.it",
  "gestione@istitutostradivari.it",
  "caianiello@istitutostradivari.it",
  "lana@istitutostradivari.it",
  "porfido@istitutostradivari.it"
];



// Nome colonne attese nel foglio (devono combaciare esattamente con l'header).
var COL_EMAIL = "Indirizzo email";
var COL_ANNO = "Anno scolastico";
var COL_TITOLO = "Titolo del corso";
var COL_ORE = "Durata del corso (in ore, non inserire frazioni, solo numeri interi)";




/**
* Funzione di SOLO TEST: usala una volta per autorizzare manualmente
* gli scope (Gmail/MailApp) dall'editor Apps Script.
* Selezionala dal menu a tendina in alto ed esegui "Esegui".
* Sostituisci "Rossi" con un cognome realmente presente nel foglio
* per evitare l'errore "Nessun corso trovato".
*/
function autorizza() {
 return sendTrainingPdf("nuzzo");
}




function doGet(e) {
 return HtmlService.createHtmlOutputFromFile('index')
   .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}




/**
* Legge il foglio e restituisce le righe (con indice riga reale) che
* corrispondono al cognome cercato, filtrando solo le mail
* @istitutostradivari.it che contengono il cognome.
*/
function _findDocenteRows_(cognome) {
 if (!cognome || String(cognome).trim() === "") {
   throw "Devi inserire il tuo cognome.";
 }


 const ss = SpreadsheetApp.getActiveSpreadsheet();
 const sh = ss.getSheets()[0];
 if (!sh) throw "Nessun foglio trovato nel file.";


 const data = sh.getDataRange().getValues();
 if (data.length < 2) return { rows: [], header: [] };


 const header = data[0].map(h => String(h).trim());
 const emailIndex = header.indexOf(COL_EMAIL);
 const annoIndex = header.indexOf(COL_ANNO);
 const titoloIndex = header.indexOf(COL_TITOLO);
 const oreIndex = header.indexOf(COL_ORE);


 if (emailIndex === -1) throw "Colonna 'Indirizzo email' non trovata.";
 if (oreIndex === -1) throw "Colonna ore non trovata.";


 const target = cognome.trim().toLowerCase();
 const rows = [];


 for (let i = 1; i < data.length; i++) {
   const email = String(data[i][emailIndex] || "").trim().toLowerCase();
   if (email.endsWith("@istitutostradivari.it") && email.includes(target)) {
     const ore = Number(data[i][oreIndex]);
     rows.push({
       email: data[i][emailIndex],
       anno: annoIndex !== -1 ? data[i][annoIndex] : "",
       titolo: titoloIndex !== -1 ? data[i][titoloIndex] : "",
       ore: isNaN(ore) ? 0 : ore
     });
   }
 }


 return { rows: rows, header: header };
}




/**
* Funzione esistente: calcola solo il totale ore (usata dal pulsante
* "Calcola ore" della pagina).
*/
function getTrainingHours(cognome) {
 try {
   const result = _findDocenteRows_(cognome);
   let total = 0;
   result.rows.forEach(r => { total += r.ore; });
   return total;
 } catch (err) {
   throw String(err);
 }
}




/**
* Nuova funzione: genera il PDF di riepilogo e lo invia via email al
* docente. Restituisce un messaggio di conferma con l'indirizzo a cui
* è stato inviato.
*/
function sendTrainingPdf(cognome) {
 try {
   const result = _findDocenteRows_(cognome);
   const rows = result.rows;


   if (rows.length === 0) {
     throw "Nessun corso trovato per il cognome inserito.";
   }


   // Email del docente presa dalla prima riga trovata (colonna 2 del foglio).
   const emailDocente = rows[0].email;
   const nomeVisualizzato = emailDocente.split("@")[0]
     .replace(/[\.\-_]/g, " ")
     .replace(/\b\w/g, c => c.toUpperCase());


   let totale = 0;
   rows.forEach(r => { totale += r.ore; });


   const html = _buildPdfHtml_(nomeVisualizzato, rows, totale);
   const blob = Utilities.newBlob(html, "text/html", "riepilogo.html")
     .getAs("application/pdf")
     .setName("Riepilogo_Ore_Formazione_" + nomeVisualizzato.replace(/ /g, "_") + ".pdf");


   MailApp.sendEmail({
     to: emailDocente,
     subject: "Riepilogo Ore di Formazione – Triennio 2025/2028",
     htmlBody:
       "<p>Gentile " + nomeVisualizzato + ",</p>" +
       "<p>in allegato il riepilogo aggiornato delle ore di formazione registrate " +
       "nel triennio 2025/2028, con il dettaglio dei corsi e il totale rispetto alla soglia minima di " +
       ORE_MINIME_TRIENNIO + " ore.</p>" +
       "<p>Istituto di Istruzione Superiore \"Antonio Stradivari\" – Cremona</p>",
     attachments: [blob],
     name: "Stradilab – IIS Stradivari"
   });


   return "PDF inviato a " + emailDocente;


 } catch (err) {
   throw String(err);
 }
}




/**
* Costruisce l'HTML del PDF con grafica istituzionale (logo, colori
* navy/crimson Stradilab), elenco corsi e totale ore.
*/
function _buildPdfHtml_(nomeDocente, rows, totale) {
 const oggi = Utilities.formatDate(new Date(), "Europe/Rome", "dd/MM/yyyy");
 const percentuale = Math.min(100, Math.round((totale / ORE_MINIME_TRIENNIO) * 100));
 const completato = totale >= ORE_MINIME_TRIENNIO;


 let righeTabella = "";
 rows.forEach(r => {
   righeTabella +=
     "<tr>" +
       "<td>" + (r.anno || "-") + "</td>" +
       "<td>" + (r.titolo || "-") + "</td>" +
       "<td class=\"ore\">" + r.ore + "</td>" +
     "</tr>";
 });


 return `
 <html>
 <head>
   <meta charset="UTF-8">
   <style>
     body {
       font-family: Arial, sans-serif;
       color: #1a1a1a;
       margin: 0;
       padding: 0;
     }
     .header {
       display: table;
       width: 100%;
       border-bottom: 3px solid #1B3A6B;
       padding-bottom: 12px;
       margin-bottom: 24px;
     }
     .header img {
       max-width: 320px;
     }
     h1 {
       color: #1B3A6B;
       font-size: 18px;
       margin: 24px 0 4px 0;
     }
     .subtitle {
       color: #9b2335;
       font-size: 12px;
       font-weight: bold;
       margin-bottom: 20px;
     }
     .info {
       font-size: 11px;
       color: #444;
       margin-bottom: 18px;
     }
     table {
       width: 100%;
       border-collapse: collapse;
       font-size: 11px;
       margin-bottom: 20px;
     }
     th {
       background-color: #1B3A6B;
       color: #fff;
       text-align: left;
       padding: 6px 8px;
     }
     td {
       padding: 6px 8px;
       border-bottom: 1px solid #ddd;
     }
     td.ore {
       text-align: center;
       font-weight: bold;
     }
     tr:nth-child(even) {
       background-color: #f7f3ee;
     }
     .totale-box {
       margin-top: 10px;
       padding: 14px 18px;
       background-color: #f7f3ee;
       border-left: 4px solid #9b2335;
     }
     .totale-box .num {
       font-size: 22px;
       font-weight: bold;
       color: #1B3A6B;
     }
     .totale-box .stato {
       font-size: 12px;
       font-weight: bold;
       color: ${completato ? "#2e7d32" : "#9b2335"};
       margin-top: 4px;
     }
     .footer {
       margin-top: 30px;
       font-size: 9px;
       color: #888;
       border-top: 1px solid #ddd;
       padding-top: 8px;
     }
   </style>
 </head>
 <body>
   <div class="header">
     <img src="data:image/jpeg;base64,${LOGO_BASE64}">
   </div>


   <h1>Riepilogo Ore di Formazione – Triennio 2025/2028</h1>
   <div class="subtitle">Docente: ${nomeDocente}</div>
   <div class="info">Documento generato automaticamente il ${oggi}</div>


   <table>
     <thead>
       <tr>
         <th>Anno scolastico</th>
         <th>Titolo del corso</th>
         <th>Ore</th>
       </tr>
     </thead>
     <tbody>
       ${righeTabella}
     </tbody>
   </table>


   <div class="totale-box">
     <div class="num">${totale} / ${ORE_MINIME_TRIENNIO} ore</div>
     <div class="stato">${completato ? "Soglia minima del triennio raggiunta" : "Soglia minima del triennio (" + percentuale + "%)"}</div>
   </div>


   <div class="footer">
     Istituto di Istruzione Superiore "Antonio Stradivari" – Cremona &middot; C.F./P.I. 80004640191 &middot; Cod. Min. CRIS00800D<br>
     Documento generato automaticamente dal sistema Stradilab – non richiede firma.
   </div>
 </body>
 </html>
 `;
}



/**
* ============================================================
*  VISTA DIRIGENTE  (quadro complessivo di tutte le attività)
* ============================================================
*/

// Email dell'utente Google che sta usando la pagina (dominio istitutostradivari.it).
function getUtenteCorrente() {
 try { return String(Session.getActiveUser().getEmail() || ""); }
 catch (e) { return ""; }
}

// true se l'utente collegato è tra gli ACCOUNT_DIRIGENTE.
function isDirigente() {
 var email = getUtenteCorrente().toLowerCase();
 if (!email) return false;
 for (var i = 0; i < ACCOUNT_DIRIGENTE.length; i++) {
   if (ACCOUNT_DIRIGENTE[i].toLowerCase() === email) return true;
 }
 return false;
}

// Ricava un nome leggibile dall'indirizzo email (nome.cognome@... -> "Nome Cognome").
function _nomeDaEmail_(email) {
 return String(email).split("@")[0]
   .replace(/[\.\-_]/g, " ")
   .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

// Stato semaforo in base alle ore totali.
function _statoOre_(ore) {
 if (ore > SOGLIA_VERDE)  return "verde";
 if (ore >= SOGLIA_GIALLO) return "giallo";
 return "rosso";
}

/**
* Restituisce il quadro completo per il dirigente: un docente per riga
* (email raggruppate), con ore totali, numero corsi e stato semaforo,
* più le statistiche complessive. Accessibile solo agli ACCOUNT_DIRIGENTE.
*/
function getDirigenteData() {
 if (!isDirigente()) {
   var chi = getUtenteCorrente();
   throw "Accesso riservato al dirigente." + (chi ? " Account collegato: " + chi : "");
 }

 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sh = ss.getSheets()[0];
 if (!sh) throw "Nessun foglio trovato nel file.";

 var data = sh.getDataRange().getValues();
 if (data.length < 2) {
   return { docenti: [], stats: { totale: 0, verde: 0, giallo: 0, rosso: 0 }, aggiornato: "" };
 }

 var header = data[0].map(function (h) { return String(h).trim(); });
 var emailIndex = header.indexOf(COL_EMAIL);
 var oreIndex   = header.indexOf(COL_ORE);
 if (emailIndex === -1) throw "Colonna '" + COL_EMAIL + "' non trovata.";
 if (oreIndex   === -1) throw "Colonna ore non trovata.";

 var mappa = {}; // chiave: email minuscolo
 for (var i = 1; i < data.length; i++) {
   var email = String(data[i][emailIndex] || "").trim();
   if (!email || email.toLowerCase().indexOf("@istitutostradivari.it") === -1) continue;

   var ore = Number(data[i][oreIndex]);
   if (isNaN(ore)) ore = 0;

   var key = email.toLowerCase();
   if (!mappa[key]) {
     mappa[key] = { email: email, nome: _nomeDaEmail_(email), ore: 0, corsi: 0 };
   }
   mappa[key].ore   += ore;
   mappa[key].corsi += 1;
 }

 var docenti = Object.keys(mappa).map(function (k) {
   var d = mappa[k];
   d.stato = _statoOre_(d.ore);
   return d;
 });

 // Ordine: prima i più indietro (rosso, giallo, verde), poi per nome.
 var peso = { rosso: 0, giallo: 1, verde: 2 };
 docenti.sort(function (a, b) {
   if (peso[a.stato] !== peso[b.stato]) return peso[a.stato] - peso[b.stato];
   return a.nome.localeCompare(b.nome);
 });

 var stats = { totale: docenti.length, verde: 0, giallo: 0, rosso: 0 };
 docenti.forEach(function (d) { stats[d.stato]++; });

 return {
   docenti: docenti,
   stats: stats,
   aggiornato: Utilities.formatDate(new Date(), "Europe/Rome", "dd/MM/yyyy HH:mm")
 };
}

