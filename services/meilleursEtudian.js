const db = require('../db/database.js');
const { logWarning } = require('../utils/logger.js');
const { DateValide } = require('../utils/validation.js');

async function meilleurEtudiant(classe) {
    try {
        const stmt = await db.prepare(`
            SELECT students.matricule, students.nom, students.prenom, AVG(grades.note) AS moyenne
            FROM students
            JOIN grades ON students.id = grades.student_id
            WHERE students.classe = ?
            GROUP BY students.id
            ORDER BY moyenne DESC
            LIMIT 1
        `);
        const result = await stmt.get([classe]);
        return result || null;
    } catch (err) {
        logWarning(`Echec recherche meilleur etudiant classe ${classe} : ${err.message}`);
        return null;
    }
}

async function moyenneGeneraleClasse(classe) {
    try {
        const stmt = await db.prepare(`
            SELECT AVG(grades.note) AS moyenne
            FROM grades
            JOIN students ON grades.student_id = students.id
            WHERE students.classe = ?
        `);
        const result = await stmt.get([classe]);
        return result.moyenne !== null ? Number(result.moyenne.toFixed(2)) : null;
    } catch (err) {
        logWarning(`Echec calcul moyenne generale classe ${classe} : ${err.message}`);
        return null;
    }
}

async function compterAbsencesJour(date, classe = null) {
    if (!DateValide(date)) {
        logWarning(`Date invalide pour comptage absences : ${date}`);
        return null;
    }
    try {
        if (classe) {
            const stmt = await db.prepare(`
                SELECT COUNT(*) AS total
                FROM absences
                JOIN students ON absences.student_id = students.id
                WHERE absences.date = ? AND students.classe = ?
            `);
            const row = await stmt.get([date, classe]);
            return row.total;
        }
        const stmt = await db.prepare('SELECT COUNT(*) AS total FROM absences WHERE date = ?');
        const row = await stmt.get([date]);
        return row.total;
    } catch (err) {
        logWarning(`Echec comptage absences du ${date} : ${err.message}`);
        return null;
    }
}

module.exports = { meilleurEtudiant, moyenneGeneraleClasse, compterAbsencesJour };