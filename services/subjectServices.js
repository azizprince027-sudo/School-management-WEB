    const db = require('../db/database.js');
    const { logInfo, logWarning } = require('../utils/logger.js');
    const { NonVide } = require('../utils/validation.js');

    function ajouterMatiere(nom, teacherId = null) {
        if (!NonVide(nom)) {
            logWarning('Ajout matiere impossible : nom vide');
            return null;
        }
        const stmt = db.prepare('INSERT INTO subjects (nom, teacher_id) VALUES (?, ?)');
        const result = stmt.run(nom, teacherId);
        logInfo(`Matiere ajoutee : ${nom}`);
        return result.lastInsertRowid;
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
        logWarning(`Affectation impossible : professeur ${teacherId} introuvable`);
        return false;
    }
}

    function listerMatieres() {
        return db.prepare(`
    SELECT subjects.id, subjects.nom, teachers.nom AS professeur
    FROM subjects
    LEFT JOIN teachers ON subjects.teacher_id = teachers.id
    `).all();
    }

    function supprimerMatiere(subjectId) {
        try {
            db.prepare('DELETE FROM subjects WHERE id = ?').run(subjectId);
            logInfo(`Matiere supprimee : id ${subjectId}`);
            return true;
        } catch (err) {
            logWarning(`Suppression matiere ${subjectId} impossible : notes liees`);
            return false;
        }
    }

    module.exports = { ajouterMatiere, affecterProfesseur, listerMatieres, supprimerMatiere };