const db = require('../db/database.js');
// Meilleur etudiant d'une classe selon sa moyenne
function meilleurEtudiant(classe) {
    const result = db.prepare(`
SELECT students.matricule, students.nom, students.prenom, AVG(grades.note) AS moyenne
FROM students
JOIN grades ON students.id = grades.student_id
WHERE students.classe = ?
GROUP BY students.id
ORDER BY moyenne DESC
LIMIT 1
`).get(classe);
    return result || null;
}
// Moyenne generale de la classe (moyenne de toutes les notes de la classe)
function moyenneGeneraleClasse(classe) {
    const result = db.prepare(`
SELECT AVG(grades.note) AS moyenne
FROM grades
JOIN students ON grades.student_id = students.id
WHERE students.classe = ?
`).get(classe);
    return result.moyenne !== null ? Number(result.moyenne.toFixed(2)) : null;
}
// Nombre d'absences pour une date donnee (toute l'ecole ou une classe)
function compterAbsencesJour(date, classe = null) {
    if (classe) {
        const row = db.prepare(`
SELECT COUNT(*) AS total
FROM absences
JOIN students ON absences.student_id = students.id
WHERE absences.date = ? AND students.classe = ?
`).get(date, classe);
        return row.total;
    }
    const row = db.prepare(
        'SELECT COUNT(*) AS total FROM absences WHERE date = ?'
    ).get(date);
    return row.total;
}
module.exports = { meilleurEtudiant, moyenneGeneraleClasse, compterAbsencesJour };