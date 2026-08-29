const Database = require('better-sqlite3');
const path = require('path');
const turso = require('./db/database.js'); // ta connexion Turso

// Connexion à ton ANCIENNE base locale (lecture seule ici)
const localDb = new Database(path.join(__dirname, 'school.db'));

// Ordre important : on respecte les clés étrangères
// (users avant teachers, teachers avant subjects, students avant grades/absences)
const tables = ['users', 'students', 'teachers', 'subjects', 'grades', 'absences'];

async function migrateTable(tableName) {
    const rows = localDb.prepare(`SELECT * FROM ${tableName}`).all();

    if (rows.length === 0) {
        console.log(`ℹ️  Table "${tableName}" : aucune donnée à migrer`);
        return;
    }

    // On construit dynamiquement la requête INSERT à partir des colonnes
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

    const stmt = await turso.prepare(sql);

    for (const row of rows) {
        const values = columns.map(col => row[col]);
        await stmt.run(values);
    }

    console.log(`✅ Table "${tableName}" : ${rows.length} ligne(s) migrée(s)`);
}

async function migrateAll() {
    try {
        for (const table of tables) {
            await migrateTable(table);
        }
        console.log('🎉 Migration terminée avec succès');
    } catch (error) {
        console.error('❌ Erreur pendant la migration :', error);
    } finally {
        localDb.close();
    }
}

migrateAll();