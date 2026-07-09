    const db = require('../db/database.js');
    const { logInfo, logWarning } = require('../utils/logger.js');
    const { DateValide } = require('../utils/validation.js');

    function enregistrerAbsence(studentId, date) {
        if (!DateValide(date)) {
            logWarning(`Date invalide rejetee : ${date}`);
            return false;
        }
        db.prepare(
            "INSERT INTO absences (student_id, date, status) VALUES (?, ?, 'non_justifiee')"
        ).run(studentId, date);
        logInfo(`Absence enregistree : etudiant ${studentId} le ${date}`);
        return true;
    }

    function marquerStatut(absenceId, status) {
        const result = db.prepare('UPDATE absences SET status = ? WHERE id = ?').run(status, absenceId);
        if (result.changes === 0) {
            logWarning(`Marquage impossible : absence ${absenceId} introuvable`);
            return false;
        }
        logInfo(`Absence ${absenceId} marquee ${status}`);
        return true;
    }

    function historiqueEtudiant(studentId) {
        return db.prepare('SELECT * FROM absences WHERE student_id = ?').all(studentId);
    }

    function historiqueClasse(classe) {
        return db.prepare(`
    SELECT absences.*, students.nom, students.prenom
    FROM absences
    JOIN students ON absences.student_id = students.id
    WHERE students.classe = ?
    `).all(classe);
    }

    module.exports = {
        enregistrerAbsence,
        marquerStatut,
        historiqueEtudiant,
        historiqueClasse
    };