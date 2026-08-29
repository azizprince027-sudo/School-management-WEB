const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NoteValide } = require('../utils/validation.js');

async function ajouterNote(studentId, subjectId, note) {
    if (!NoteValide(note)) {
        logWarning(`Note invalide rejetee : ${note}`);
        return false;
    }
    try {
        const stmt = await db.prepare('INSERT INTO grades (student_id, subject_id, note) VALUES (?, ?, ?)');
        await stmt.run(studentId, subjectId, note);
        logInfo(`Note ajoutee : etudiant ${studentId}, matiere ${subjectId}, note ${note}`);
        return true;
    } catch (err) {
        logWarning(`Echec ajout note etudiant ${studentId}, matiere ${subjectId} : ${err.message}`);
        return false;
    }
}

async function modifierNote(gradeId, nouvelleNote) {
    if (!NoteValide(nouvelleNote)) {
        logWarning(`Note invalide rejetee : ${nouvelleNote}`);
        return false;
    }
    try {
        const stmt = await db.prepare('UPDATE grades SET note = ? WHERE id = ?');
        const result = await stmt.run(nouvelleNote, gradeId);
        if (result.changes === 0) {
            logWarning(`Modification impossible : note ${gradeId} introuvable`);
            return false;
        }
        logInfo(`Note modifiee : id ${gradeId}`);
        return true;
    } catch (err) {
        logWarning(`Echec modification note ${gradeId} : ${err.message}`);
        return false;
    }
}

async function supprimerNote(gradeId) {
    try {
        const stmt = await db.prepare('DELETE FROM grades WHERE id = ?');
        const result = await stmt.run(gradeId);
        if (result.changes === 0) {
            logWarning(`Suppression impossible : note ${gradeId} introuvable`);
            return false;
        }
        logInfo(`Note supprimee : id ${gradeId}`);
        return true;
    } catch (err) {
        logWarning(`Echec suppression note ${gradeId} : ${err.message}`);
        return false;
    }
}

async function moyenneEtudiant(studentId) {
    try {
        const stmt = await db.prepare('SELECT AVG(note) AS moyenne FROM grades WHERE student_id = ?');
        const row = await stmt.get(studentId);
        return row.moyenne !== null ? Number(row.moyenne.toFixed(2)) : null;
    } catch (err) {
        logWarning(`Echec calcul moyenne etudiant ${studentId} : ${err.message}`);
        return null;
    }
}

async function notesEtudiant(studentId) {
    try {
        const stmt = await db.prepare(`
            SELECT grades.id, subjects.nom AS matiere, grades.note
            FROM grades
            JOIN subjects ON grades.subject_id = subjects.id
            WHERE grades.student_id = ?
        `);
        return await stmt.all(studentId);
    } catch (err) {
        logWarning(`Echec de recuperation notes etudiant ${studentId} : ${err.message}`);
        return [];
    }
}

module.exports = { ajouterNote, modifierNote, supprimerNote, moyenneEtudiant, notesEtudiant };