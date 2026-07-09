const db = require('../db/database.js');
const { logInfo } = require('../utils/logger.js');
// L'admin cree un compte professeur (role = professeur)
function ajouterUser(name, role, codeAcces) {
    const stmt = db.prepare(
        'INSERT INTO users (name, role, code_acces) VALUES (?, ?, ?)'
    );

    const result = stmt.run(name, role, codeAcces);
    logInfo(`Utilisateur ajoute : ${name} (${role})`);
    return result.lastInsertRowid;
}
// La fonction "ajouterUser" est utilisée pour ajouter un nouvel utilisateur (professeur) à la base de données. Elle prend trois paramètres : "name" qui représente le nom de l'utilisateur, "role" qui représente le rôle de l'utilisateur (dans ce cas, 'professeur'), et "codeAcces" qui représente le code d'accès de l'utilisateur. La fonction utilise une requête SQL préparée pour insérer ces informations dans la table "users". Après l'insertion, un message d'information est enregistré dans le journal pour indiquer que l'utilisateur a été ajouté avec succès, et la fonction retourne l'identifiant de la nouvelle ligne insérée dans la base de données.
function supprimerUser(id) {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    logInfo(`Utilisateur supprime : id ${id}`);
}
// La fonction "supprimerUser" est utilisée pour supprimer un utilisateur de la base de données en fonction de son identifiant. Elle prend un paramètre "id" qui représente l'identifiant de l'utilisateur à supprimer. La fonction utilise une requête SQL préparée pour supprimer l'utilisateur correspondant à cet identifiant de la table "users". Après la suppression, un message d'information est enregistré dans le journal pour indiquer que l'utilisateur a été supprimé avec succès, en précisant l'identifiant de l'utilisateur supprimé.
function listerUsers() {
    return db.prepare('SELECT * FROM users').all();
}
// La fonction "listerUsers" est utilisée pour récupérer la liste de tous les utilisateurs présents dans la base de données. Elle exécute une requête SQL préparée qui sélectionne toutes les colonnes de la table "users" et retourne le résultat sous forme de tableau d'objets. Chaque objet représente un utilisateur avec ses propriétés correspondantes (id, name, role, code_acces). Cette fonction peut être utilisée pour afficher la liste des utilisateurs dans l'application ou pour effectuer d'autres opérations nécessitant l'accès à tous les utilisateurs.
module.exports = { ajouterUser, supprimerUser, listerUsers };