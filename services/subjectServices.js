const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide } = require('../utils/validation.js');

async function ajouterMatiere(nom, teacherId = null) {
    if (!NonVide(nom)) {
        logWarning('Ajout matiere impossible : nom vide');
        return null;
    }
    try {
        const stmt = await db.prepare('INSERT INTO subjects (nom, teacher_id) VALUES (?, ?)');
        const result = await stmt.run([nom, teacherId]);
        logInfo(`Matiere ajoutee : ${nom}`);
        return result.lastInsertRowid;
    } catch (err) {
        logWarning(`Echec ajout matiere ${nom} : ${err.message}`);
        return null;
    }
}

async function affecterProfesseur(subjectId, teacherId) {
    try {
        const stmt = await db.prepare('UPDATE subjects SET teacher_id = ? WHERE id = ?');
        const result = await stmt.run([teacherId, subjectId]);
        if (result.changes === 0) {
            logWarning(`Affectation impossible : matiere ${subjectId} introuvable`);
            return false;
        }
        logInfo(`Professeur ${teacherId} affecte a la matiere ${subjectId}`);
        return true;
    } catch (err) {
        logWarning(`Echec affectation professeur ${teacherId} a matiere ${subjectId} : ${err.message}`);
        return false;
    }
}

async function listerMatieres() {
    try {
        const stmt = await db.prepare(`
            SELECT subjects.id, subjects.nom, teachers.nom AS professeur
            FROM subjects
            LEFT JOIN teachers ON subjects.teacher_id = teachers.id
        `);
        return await stmt.all();
    } catch (err) {
        logWarning(`Echec liste matieres : ${err.message}`);
        return [];
    }
}

async function supprimerMatiere(subjectId) {
    try {
        const stmt = await db.prepare('DELETE FROM subjects WHERE id = ?');
        const result = await stmt.run([subjectId]);
        if (result.changes === 0) {
            logWarning(`Suppression impossible : matiere ${subjectId} introuvable`);
            return null;
        }
        logInfo(`Matiere supprimee : id ${subjectId}`);
        return true;
    } catch (err) {
        logWarning(`Suppression matiere ${subjectId} impossible : ${err.message}`);
        return false;
    }
}

module.exports = { ajouterMatiere, affecterProfesseur, listerMatieres, supprimerMatiere };