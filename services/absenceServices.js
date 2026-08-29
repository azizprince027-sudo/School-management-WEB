const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { DateValide } = require('../utils/validation.js');

async function enregistrerAbsence(studentId, date) {
    if (!DateValide(date)) {
        logWarning(`Date invalide rejetee : ${date}`);
        return false;
    }
    try {
        const stmt = await db.prepare(
            "INSERT INTO absences (student_id, date, status) VALUES (?, ?, 'non_justifiee')"
        );
        await stmt.run(studentId, date);
        logInfo(`Absence enregistree : etudiant ${studentId} le ${date}`);
        return true;
    } catch (err) {
        logWarning(`Echec enregistrement absence etudiant ${studentId} : ${err.message}`);
        return false;
    }
}

const STATUTS_VALIDES = ['justifiee', 'non_justifiee'];

async function marquerStatut(absenceId, status) {
    if (!STATUTS_VALIDES.includes(status)) {
        logWarning(`Statut invalide rejete : ${status}`);
        return false;
    }
    try {
        const stmt = await db.prepare('UPDATE absences SET status = ? WHERE id = ?');
        const result = await stmt.run(status, absenceId);
        if (result.changes === 0) {
            logWarning(`Marquage impossible : absence ${absenceId} introuvable`);
            return false;
        }
        logInfo(`Absence ${absenceId} marquee ${status}`);
        return true;
    } catch (err) {
        logWarning(`Echec marquage absence ${absenceId} : ${err.message}`);
        return false;
    }
}

async function historiqueEtudiant(studentId) {
    try {
        const stmt = await db.prepare('SELECT id, student_id, date, status FROM absences WHERE student_id = ?');
        return await stmt.all(studentId);
    } catch (err) {
        logWarning(`Echec recuperation historique etudiant ${studentId} : ${err.message}`);
        return [];
    }
}

async function historiqueClasse(classe) {
    try {
        const stmt = await db.prepare(`
            SELECT absences.id, absences.date, absences.status, students.nom, students.prenom
            FROM absences
            JOIN students ON absences.student_id = students.id
            WHERE students.classe = ?
        `);
        return await stmt.all(classe);
    } catch (err) {
        logWarning(`Echec recuperation historique classe ${classe} : ${err.message}`);
        return [];
    }
}

module.exports = { enregistrerAbsence, marquerStatut, historiqueEtudiant, historiqueClasse };