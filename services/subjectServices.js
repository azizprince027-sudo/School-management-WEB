    const db = require('../db/database.js');
    const { logInfo, logWarning } = require('../utils/logger.js');
    const { NonVide } = require('../utils/validation.js');

    function ajouterMatiere(nom, teacherId = null) {
    if (!NonVide(nom)) {
        logWarning('Ajout matiere impossible : nom vide');
        return null;
    }
    try {
        const stmt = db.prepare('INSERT INTO subjects (nom, teacher_id) VALUES (?, ?)');
        const result = stmt.run(nom, teacherId);
        logInfo(`Matiere ajoutee : ${nom}`);
        return result.lastInsertRowid;
    } catch (err) {
        logWarning(`Echec ajout matiere ${nom} : ${err.message}`);
        return null;
    }
}

    function affecterProfesseur(subjectId, teacherId) {
    try {
        const result = db.prepare('UPDATE subjects SET teacher_id = ? WHERE id = ?').run(teacherId, subjectId);
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

    function listerMatieres() {
    try {
        return db.prepare(`
            SELECT subjects.id, subjects.nom, teachers.nom AS professeur
            FROM subjects
            LEFT JOIN teachers ON subjects.teacher_id = teachers.id
        `).all();
    } catch (err) {
        logWarning(`Echec liste matieres : ${err.message}`);
        return [];
    }
}

    function supprimerMatiere(subjectId) {
    try {
        const result = db.prepare('DELETE FROM subjects WHERE id = ?').run(subjectId);
        if (result.changes === 0) {
            logWarning(`Suppression impossible : matiere ${subjectId} introuvable`);
            return false;
        }
        logInfo(`Matiere supprimee : id ${subjectId}`);
        return true;
    } catch (err) {
        logWarning(`Suppression matiere ${subjectId} impossible : ${err.message}`);
        return false;
    }
}

    module.exports = { ajouterMatiere, affecterProfesseur, listerMatieres, supprimerMatiere };