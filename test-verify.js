const db = require('./db/database.js');

async function verify() {
    const tables = ['users', 'students', 'teachers', 'subjects', 'grades', 'absences'];
    try {
        for (const table of tables) {
            const stmt = await db.prepare(`SELECT COUNT(*) AS total FROM ${table}`);
            const result = await stmt.get();
            console.log(`${table} : ${result.total} ligne(s)`);
        }
    } catch (error) {
        console.error('❌ Erreur de vérification :', error);
    }
}

verify();