const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide, AgeValide } = require('../utils/validation.js');

async function ajouterEtudiant(matricule, nom, prenom, age, classe) {
    if (!NonVide(matricule) || !NonVide(nom) || !NonVide(prenom) || !AgeValide(age) || !NonVide(classe)) {
        logWarning(`Champs invalides pour ajout etudiant : ${matricule}`);
        return false;
    }
    try {
        const stmt = await db.prepare(
            'INSERT INTO students (matricule, nom, prenom, age, classe) VALUES (?, ?, ?, ?, ?)'
        );
        await stmt.run([matricule, nom, prenom, age, classe]);
        logInfo(`Etudiant ajoute : ${matricule}`);
        return true;
    } catch (err) {
        logWarning(`Echec ajout etudiant (matricule en double ?) : ${matricule}`);
        return false;
    }
}

async function modifierEtudiant(matricule, champs) {
    const { nom, prenom, age, classe } = champs;
    if (!NonVide(nom) || !NonVide(prenom) || !AgeValide(age) || !NonVide(classe)) {
        logWarning(`Champs invalides pour modification : ${matricule}`);
        return false;
    }
    try {
        const stmt = await db.prepare(
            'UPDATE students SET nom = ?, prenom = ?, age = ?, classe = ? WHERE matricule = ?'
        );
        const result = await stmt.run([nom, prenom, age, classe, matricule]);
        if (result.changes === 0) {
            logWarning(`Modification impossible : etudiant ${matricule} introuvable`);
            return false;
        }
        logInfo(`Etudiant modifie : ${matricule}`);
        return true;
    } catch (err) {
        logWarning(`Echec modification etudiant ${matricule} : ${err.message}`);
        return false;
    }
}

async function supprimerEtudiant(matricule) {
    try {
        const stmt = await db.prepare('DELETE FROM students WHERE matricule = ?');
        const result = await stmt.run([matricule]);
        if (result.changes === 0) return null;
        logInfo(`Etudiant supprime : ${matricule}`);
        return true;
    } catch (err) {
        logWarning(`Suppression etudiant ${matricule} impossible : ${err.message}`);
        return false;
    }
}

async function rechercherEtudiant(matricule) {
    try {
        const stmt = await db.prepare('SELECT * FROM students WHERE matricule = ?');
        return await stmt.get([matricule]);
    } catch (err) {
        logWarning(`Echec recherche etudiant ${matricule} : ${err.message}`);
        return null;
    }
}

async function listerEtudiants(classe = null) {
    try {
        if (classe) {
            const stmt = await db.prepare('SELECT * FROM students WHERE classe = ?');
            return await stmt.all([classe]);
        }
        const stmt = await db.prepare('SELECT * FROM students');
        return await stmt.all();
    } catch (err) {
        logWarning(`Echec liste etudiants : ${err.message}`);
        return [];
    }
}

module.exports = { ajouterEtudiant, modifierEtudiant, supprimerEtudiant, rechercherEtudiant, listerEtudiants };