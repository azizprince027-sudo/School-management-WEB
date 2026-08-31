const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide } = require('../utils/validation.js');

async function ajouterUser(name, role, codeAcces) {
    name = name ? name.trim() : null;
    role = role ? role.trim() : null;
    codeAcces = codeAcces ? codeAcces.trim() : null;

    if (!NonVide(name) || !NonVide(role) || !NonVide(codeAcces)) {
        logWarning(`Champs invalides pour ajout utilisateur : ${name}`);
        return null;
    }

    try {
        const stmtVerif = await db.prepare('SELECT id FROM users WHERE name = ? AND code_acces = ?');
        const existant = await stmtVerif.get([name, codeAcces]);
        if (existant) {
            logWarning(`Ajout utilisateur refuse : nom + code d'acces deja utilises : ${name}`);
            return null;
        }

        const stmt = await db.prepare('INSERT INTO users (name, role, code_acces) VALUES (?, ?, ?)');
        const result = await stmt.run([name, role, codeAcces]);
        logInfo(`Utilisateur ajoute : ${name} (${role})`);
        return result.lastInsertRowid;
    } catch (err) {
        logWarning(`Echec ajout utilisateur ${name} : ${err.message}`);
        return null;
    }
}

async function supprimerUser(id) {
    const supprimer = db.transactionAsync(async(tx, id) => {
        const s1 = await tx.prepare('DELETE FROM teachers WHERE user_id = ?');
        await s1.run([id]);
        const s2 = await tx.prepare('DELETE FROM users WHERE id = ?');
        return await s2.run([id]);
    });

    try {
        const result = await supprimer(id);
        if (result.changes === 0) {
            logWarning(`Suppression impossible : utilisateur ${id} introuvable`);
            return false;
        }
        logInfo(`Utilisateur supprime : id ${id}`);
        return true;
    } catch (err) {
        logWarning(`Echec suppression utilisateur ${id} : ${err.message}`);
        return false;
    }
}

async function listerUsers() {
    try {
        const stmt = await db.prepare('SELECT id, name, role FROM users');
        return await stmt.all();
    } catch (err) {
        logWarning(`Echec liste utilisateurs : ${err.message}`);
        return [];
    }
}

module.exports = { ajouterUser, supprimerUser, listerUsers };