const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide } = require('../utils/validation.js');

// L'admin cree d'abord le compte (users), puis la fiche professeur (teachers)
// Les deux insertions sont regroupees dans une transaction : si l'une echoue,
// l'autre est annulee automatiquement (pas de compte orphelin).

function ajouterProfesseur(nom, matiere, classe, codeAcces) {
    if (!NonVide(nom) || !NonVide(matiere) || !NonVide(classe) || !NonVide(codeAcces)) {
        logWarning('Tous les champs sont requis pour ajouter un professeur');
        return null;
    }

    const creerProfesseur = db.transaction((nom, matiere, classe, codeAcces) => {
        const userResult = db.prepare(
            'INSERT INTO users (name, role, code_acces) VALUES (?, ?, ?)'
        ).run(nom, 'professeur', codeAcces);

        const result = db.prepare(
            'INSERT INTO teachers (user_id, nom, matiere, classe) VALUES (?, ?, ?, ?)'
        ).run(userResult.lastInsertRowid, nom, matiere, classe);

        return result.lastInsertRowid;
    });

    try {
        const teacherId = creerProfesseur(nom, matiere, classe, codeAcces);
        logInfo(`Professeur ajoute : ${nom} - ${matiere} - Classe ${classe}`);
        return teacherId;
    } catch (err) {
        logWarning(`Echec ajout professeur ${nom} : ${err.message}`);
        return null;
    }
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

    const modifier = db.transaction((id, userId) => {
        db.prepare('UPDATE teachers SET nom = ?, matiere = ?, classe = ? WHERE id = ?')
            .run(nom, matiere, classe, id);
        db.prepare('UPDATE users SET name = ? WHERE id = ?').run(nom, userId);
    });

    try {
        modifier(id, prof.user_id);
        logInfo(`Professeur modifie : id ${id}`);
        return true;
    } catch (err) {
        logWarning(`Echec modification professeur ${id} : ${err.message}`);
        return false;
    }
}

function supprimerProfesseur(id) {
    const prof = db.prepare('SELECT user_id FROM teachers WHERE id = ?').get(id);
    if (!prof) {
        logWarning(`Professeur introuvable pour suppression : id ${id}`);
        return false;
    }

    const supprimer = db.transaction((id, userId) => {
        db.prepare('DELETE FROM teachers WHERE id = ?').run(id);
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    });

    try {
        supprimer(id, prof.user_id);
        logInfo(`Professeur supprime : id ${id}`);
        return true;
    } catch (err) {
        logWarning(`Suppression professeur ${id} impossible : ${err.message}`);
        return false;
    }
}

function rechercherProfesseur(id) {
    try {
        return db.prepare('SELECT id, user_id, nom, matiere, classe FROM teachers WHERE id = ?').get(id);
    } catch (err) {
        logWarning(`Echec recherche professeur ${id} : ${err.message}`);
        return null;
    }
}

function listerProfesseurs() {
    try {
        return db.prepare('SELECT id, user_id, nom, matiere, classe FROM teachers').all();
    } catch (err) {
        logWarning(`Echec liste professeurs : ${err.message}`);
        return [];
    }
}

// Recupere la fiche professeur a partir du user_id (utile apres le login)
function getProfesseurParUserId(userId) {
    try {
        return db.prepare('SELECT id, user_id, nom, matiere, classe FROM teachers WHERE user_id = ?').get(userId);
    } catch (err) {
        logWarning(`Echec recherche professeur par user_id ${userId} : ${err.message}`);
        return null;
    }
}

module.exports = {
    ajouterProfesseur,
    modifierProfesseur,
    supprimerProfesseur,
    rechercherProfesseur,
    listerProfesseurs,
    getProfesseurParUserId
};