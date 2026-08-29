const { initDatabase } = require('./db/table.js');

async function run() {
    try {
        await initDatabase();
        console.log('✅ Tables créées sur Turso avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de la création des tables :', error);
    }
}

run();