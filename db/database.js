const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../school.db');
const db = new Database(DB_PATH);
//Le Mode WAL (Write-Ahead Logging) est un mode de journalisation qui permet d'améliorer les performances et la fiabilité des bases de données SQLite.
db.pragma('journal_mode = WAL');
// La fonction "pragma" est utilisée pour configurer les paramètres de la base de données SQLite. Ici, elle est utilisée pour activer le mode WAL (Write-Ahead Logging) en définissant la valeur de "journal_mode" sur "WAL". Cela permet d'améliorer les performances et la fiabilité des opérations d'écriture dans la base de données.
module.exports = db;