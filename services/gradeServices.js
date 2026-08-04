const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NoteValide } = require('../utils/validation.js');

function ajouterNote(studentId, subjectId, note) {
    if (!NoteValide(note)) {
        logWarning(`Note invalide rejetee : ${note}`);
        return false;
    }
    try {
        db.prepare(
            'INSERT INTO grades (student_id, subject_id, note) VALUES (?, ?, ?)'
        ).run(studentId, subjectId, note);
        logInfo(`Note ajoutee : etudiant ${studentId}, matiere ${subjectId}, note ${note}`);
        return true;
    }  catch (err) {
            logWarning(`Echec ajout note etudiant ${studentId}, matiere ${subjectId} : ${err.message}`);
            return false;
    }
}

function modifierNote(gradeId, nouvelleNote) {
    if (!NoteValide(nouvelleNote)) {
        logWarning(`Note invalide rejetee : ${nouvelleNote}`);
        return false;
    }
    try {
        const result = db.prepare('UPDATE grades SET note = ? WHERE id = ?').run(nouvelleNote, gradeId);
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

function supprimerNote(gradeId) {
    try {
        const result = db.prepare('DELETE FROM grades WHERE id = ?').run(gradeId);
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

function moyenneEtudiant(studentId) {
    try {
        const row = db.prepare('SELECT AVG(note) AS moyenne FROM grades WHERE student_id = ?').get(studentId);
        return row.moyenne !== null ? Number(row.moyenne.toFixed(2)) : null;
    } catch (err) {
        logWarning(`Echec calcul moyenne etudiant ${studentId} : ${err.message}`);
        return null;
    }
}

function notesEtudiant(studentId) {
    try {
        return db.prepare(`
            SELECT grades.id, subjects.nom AS matiere, grades.note
            FROM grades
            JOIN subjects ON grades.subject_id = subjects.id
            WHERE grades.student_id = ?
        `).all(studentId);
    } catch (err) {
        logWarning(`Echec de recuperation notes etudiant ${studentId} : ${err.message}`);
        return [];
    }
}

module.exports = {
    ajouterNote,
    modifierNote,
    supprimerNote,
    moyenneEtudiant,
    notesEtudiant
};