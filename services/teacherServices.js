const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { ajouterUser } = require('./userServices.js');
const { NonVide } = require('../utils/validation.js');
// L'admin cree d'abord le compte (users), puis la fiche professeur (teachers)

function ajouterProfesseur(nom, matiere, classe, codeAcces) {
    if (!NonVide(nom) || !NonVide(matiere) || !NonVide(classe) || !NonVide(codeAcces)) {
        logWarning('Tous les champs sont requis pour ajouter un professeur');
        return null; 
    }
    const userId = ajouterUser(nom, 'professeur', codeAcces);
    const stmt = db.prepare(
        'INSERT INTO teachers (user_id, nom, matiere, classe) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, nom, matiere, classe);
    logInfo(`Professeur ajoute : ${nom} - ${matiere} - Classe ${classe}`);
    return result.lastInsertRowid;
}

function modifierProfesseur(id, champs) {
    const { nom, matiere, classe } = champs;
    if (!NonVide(nom) || !NonVide(matiere) || !NonVide(classe)) {
        logWarning(`Champs invalides pour modification professeur : id ${id}`);
        return false;
    }
    const prof = db.prepare('SELECT user_id FROM teachers WHERE id = ?').get(id);
    if (!prof) {
        logWarning(`Professeur introuvable pour modification : id ${id}`);
        return false;
    }
    db.prepare(
        'UPDATE teachers SET nom = ?, matiere = ?, classe = ? WHERE id = ?'
    ).run(nom, matiere, classe, id);
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(nom, prof.user_id);
    logInfo(`Professeur modifie : id ${id}`);
    return true;
}

// La fonction "supprimerProfesseur" est utilisée pour supprimer un professeur de la base de données en utilisant son id. Elle prend un paramètre "id" qui représente l'id du professeur à supprimer. La fonction utilise une requête SQL préparée pour supprimer le professeur correspondant à cet id dans la table "teachers". Après la suppression, une information est enregistrée dans les logs pour indiquer que le professeur a été supprimé.
function supprimerProfesseur(id) {
    const prof = db.prepare('SELECT user_id FROM teachers WHERE id = ?').get(id);
    try {
        db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
    } catch (err) {
        logWarning(`Suppression professeur ${id} impossible : encore affecte a une matiere`);
        return false;
    }
    if (prof) {
        db.prepare('DELETE FROM users WHERE id = ?').run(prof.user_id);
    }
    logInfo(`Professeur supprime : id ${id}`);
    return true;
}
// La fonction "rechercherProfesseur" est utilisée pour rechercher un professeur dans la base de données en utilisant son id. Elle prend un paramètre "id" qui représente l'id du professeur à rechercher. La fonction utilise une requête SQL préparée pour sélectionner le professeur correspondant à cet id dans la table "teachers". Si un professeur avec cet id est trouvé, ses informations sont retournées sous forme d'objet. Si aucun professeur n'est trouvé, la fonction retourne undefined.
function rechercherProfesseur(id) {
    return db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
}
// La fonction "listerProfesseurs" est utilisée pour lister tous les professeurs présents dans la base de données. Elle utilise une requête SQL préparée pour sélectionner tous les professeurs de la table "teachers". Les informations de tous les professeurs sont retournées sous forme de tableau d'objets.
function listerProfesseurs() {
    return db.prepare('SELECT * FROM teachers').all();
}
// Recupere la fiche professeur a partir du user_id (utile apres le login)
function getProfesseurParUserId(userId) {
    return db.prepare('SELECT * FROM teachers WHERE user_id = ?').get(userId);
}
module.exports = {
    ajouterProfesseur,
    modifierProfesseur,
    supprimerProfesseur,
    rechercherProfesseur,
    listerProfesseurs,
    getProfesseurParUserId
};