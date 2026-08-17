const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide, AgeValide } = require('../utils/validation.js');
// La fonction "ajouterEtudiant" est utilisée pour ajouter un nouvel étudiant à la base de données. Elle prend cinq paramètres : "matricule" qui représente le matricule de l'étudiant, "nom" qui représente le nom de l'étudiant, "prenom" qui représente le prénom de l'étudiant, "age" qui représente l'âge de l'étudiant, et "classe" qui représente la classe de l'étudiant. La fonction utilise une requête SQL préparée pour insérer les informations de l'étudiant dans la table "students". Si l'ajout est réussi, une information est enregistrée dans les logs pour indiquer que l'étudiant a été ajouté. Si une erreur se produit (par exemple, si le matricule est déjà utilisé), une alerte est enregistrée dans les logs et la fonction retourne false.
function ajouterEtudiant(matricule, nom, prenom, age, classe) {
    if (!NonVide(matricule) || !NonVide(nom) || !NonVide(prenom) || !AgeValide(age) || !NonVide(classe)) {
        logWarning(`Champs invalides pour ajout etudiant : ${matricule}`);
        return false;
    }
    try {
        const stmt = db.prepare(
            'INSERT INTO students (matricule, nom, prenom, age, classe) VALUES (?, ?, ?, ?, ?)'
        );
        stmt.run(matricule, nom, prenom, age, classe);
        logInfo(`Etudiant ajoute : ${matricule}`);
        return true;
    } catch (err) {
        logWarning(`Echec ajout etudiant (matricule en double ?) : ${matricule}`);
        return false;
    }
}
// La fonction "modifierEtudiant" est utilisée pour modifier les informations d'un étudiant dans la base de données en utilisant son matricule. Elle prend deux paramètres : "matricule" qui représente le matricule de l'étudiant à modifier, et "champs" qui est un objet contenant les champs à modifier (nom, prenom, age, classe). La fonction utilise une requête SQL préparée pour mettre à jour les informations de l'étudiant correspondant à ce matricule dans la table "students". Après la modification, une information est enregistrée dans les logs pour indiquer que l'étudiant a été modifié.

function modifierEtudiant(matricule, champs) {
    const { nom, prenom, age, classe } = champs;
    if (!NonVide(nom) || !NonVide(prenom) || !AgeValide(age) || !NonVide(classe)) {
        logWarning(`Champs invalides pour modification : ${matricule}`);
        return false;
    }
    try {
        const result = db.prepare(
            'UPDATE students SET nom = ?, prenom = ?, age = ?, classe = ? WHERE matricule = ?'
        ).run(nom, prenom, age, classe, matricule);
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

// La fonction "supprimerEtudiant" est utilisée pour supprimer un étudiant de la base de données en utilisant son matricule. Elle prend un paramètre "matricule" qui représente le matricule de l'étudiant à supprimer. La fonction utilise une requête SQL préparée pour supprimer l'étudiant correspondant à ce matricule dans la table "students". Après la suppression, une information est enregistrée dans les logs pour indiquer que l'étudiant a été supprimé.

function supprimerEtudiant(matricule) {
    try {
        db.prepare('DELETE FROM students WHERE matricule = ?').run(matricule);
        logInfo(`Etudiant supprime : ${matricule}`);
        return true;
    } catch (err) {
        logWarning(`Suppression etudiant ${matricule} impossible : ${err.message}`);
        return false;
    }
}
// La fonction "rechercherEtudiant" est utilisée pour rechercher un étudiant dans la base de données en utilisant son matricule. Elle prend un paramètre "matricule" qui représente le matricule de l'étudiant à rechercher. La fonction utilise une requête SQL préparée pour récupérer les informations de l'étudiant correspondant à ce matricule dans la table "students". Si l'étudiant est trouvé, ses informations sont retournées sous forme d'objet. Si une erreur se produit (par exemple, si l'étudiant n'existe pas), une alerte est enregistrée dans les logs et la fonction retourne null.

function rechercherEtudiant(matricule) {
    try {
        return db.prepare('SELECT * FROM students WHERE matricule = ?').get(matricule);
    } catch (err) {
        logWarning(`Echec recherche etudiant ${matricule} : ${err.message}`);
        return null;
    }
}
// La fonction "listerEtudiants" est utilisée pour lister tous les étudiants dans la base de données, ou seulement ceux d'une classe spécifique si un paramètre "classe" est fourni. Elle prend un paramètre optionnel "classe" qui représente la classe des étudiants à lister. La fonction utilise une requête SQL préparée pour récupérer les informations des étudiants dans la table "students". Si une erreur se produit, une alerte est enregistrée dans les logs et la fonction retourne un tableau vide.

function listerEtudiants(classe = null) {
    try {
        if (classe) {
            return db.prepare('SELECT * FROM students WHERE classe = ?').all(classe);
        }
        return db.prepare('SELECT * FROM students').all();
    } catch (err) {
        logWarning(`Echec liste etudiants : ${err.message}`);
        return [];
    }
}

module.exports = {
    ajouterEtudiant,
    modifierEtudiant,
    supprimerEtudiant,
    rechercherEtudiant,
    listerEtudiants
};