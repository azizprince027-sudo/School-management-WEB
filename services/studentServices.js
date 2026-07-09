const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide, AgeValide } = require('../utils/validation.js');
// La fonction "ajouterEtudiant" est utilisée pour ajouter un nouvel étudiant à la base de données. Elle prend cinq paramètres : "matricule" qui représente le matricule de l'étudiant, "nom" qui représente le nom de l'étudiant, "prenom" qui représente le prénom de l'étudiant, "age" qui représente l'âge de l'étudiant, et "classe" qui représente la classe de l'étudiant. La fonction utilise une requête SQL préparée pour insérer les informations de l'étudiant dans la table "students". Si l'ajout est réussi, une information est enregistrée dans les logs pour indiquer que l'étudiant a été ajouté. Si une erreur se produit (par exemple, si le matricule est déjà utilisé), une alerte est enregistrée dans les logs et la fonction retourne false.
function ajouterEtudiant(matricule, nom, prenom, age, classe) {
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
    db.prepare(
        'UPDATE students SET nom = ?, prenom = ?, age = ?, classe = ? WHERE matricule = ?'
    ).run(nom, prenom, age, classe, matricule);
    logInfo(`Etudiant modifie : ${matricule}`);
    return true;
}
// La fonction "supprimerEtudiant" est utilisée pour supprimer un étudiant de la base de données en utilisant son matricule. Elle prend un paramètre "matricule" qui représente le matricule de l'étudiant à supprimer. La fonction utilise une requête SQL préparée pour supprimer l'étudiant correspondant à ce matricule dans la table "students". Après la suppression, une information est enregistrée dans les logs pour indiquer que l'étudiant a été supprimé.

function supprimerEtudiant(matricule) {
    try {
        db.prepare('DELETE FROM students WHERE matricule = ?').run(matricule);
        logInfo(`Etudiant supprime : ${matricule}`);
        return true;
    } catch (err) {
        logWarning(`Suppression etudiant ${matricule} impossible : notes/absences liees`);
        return false;
    }
}
// La fonction "rechercherEtudiant" est utilisée pour rechercher un étudiant dans la base de données en utilisant son matricule. Elle prend un paramètre "matricule" qui représente le matricule de l'étudiant à rechercher. La fonction utilise une requête SQL préparée pour sélectionner l'étudiant correspondant à ce matricule dans la table "students". Si un étudiant avec ce matricule est trouvé, ses informations sont retournées sous forme d'objet. Si aucun étudiant n'est trouvé, la fonction retourne undefined.

function rechercherEtudiant(matricule) {
    return db.prepare('SELECT * FROM students WHERE matricule = ?').get(matricule);
}
// La fonction "rechercherEtudiant" est utilisée pour rechercher un étudiant dans la base de données en utilisant son matricule. Elle prend un paramètre "matricule" qui représente le matricule de l'étudiant à rechercher. La fonction utilise une requête SQL préparée pour sélectionner l'étudiant correspondant à ce matricule dans la table "students". Si un étudiant avec ce matricule est trouvé, ses informations sont retournées sous forme d'objet. Si aucun étudiant n'est trouvé, la fonction retourne undefined.
// Liste tous les etudiants, ou seulement ceux d'une classe (utilise par les profs)
function listerEtudiants(classe = null) {
    if (classe) {
        return db.prepare('SELECT * FROM students WHERE classe = ?').all(classe);
    }
    return db.prepare('SELECT * FROM students').all();
}
module.exports = {
    ajouterEtudiant,
    modifierEtudiant,
    supprimerEtudiant,
    rechercherEtudiant,
    listerEtudiants
};