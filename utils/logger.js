const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../logs");
const LOG = path.join(LOG_DIR, "app.log");

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatDate() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function writeLog(level, message) {
    const line = `${formatDate()} [${level}] ${message}\n`;
    fs.appendFileSync(LOG, line, "utf8");
}

function logInfo(message) { writeLog("INFO", message); }

function logWarning(message) { writeLog("WARNING", message); }

function logError(message) { writeLog("ERROR", message); }

module.exports = { logInfo, logWarning, logError };

//========================================================
// j ai testé une nouvelles methodes 
// const fs = require("fs");
// const path = require("path");

// // Définition du chemin du fichier de log ( je dit sors du fich loggers et entre dans le dossier logs et crée un fichier app.log)

// const LOG = path.join(__dirname, '../logs/app.log');

// // Fonction pour écrire les logs dans le fichier (horodatage);
// function log(level, message) {
//   // convertir une date et une heure en une chaîne de caractères (du texte)
//     const date = new Date().toISOString().replace('T', ' ').slice(0, 19);
//     const ligne = `${date} [${level}] ${message}\n`;
//     fs.appendFileSync(LOG, ligne, 'utf8');
// }

// module.exports = {
//     info: (msg) => log('INFO', msg),
//     warning: (msg) => log('WARNING',msg),
//     error: (msg) => log('ERROR', msg),
// };