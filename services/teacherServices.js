const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
const { NonVide } = require('../utils/validation.js');

async function ajouterProfesseur(nom, matiere, classe, codeAcces) {
    if (!NonVide(nom) || !NonVide(matiere) || !NonVide(classe) || !NonVide(codeAcces)) {
        logWarning('Tous les champs sont requis pour ajouter un professeur');
        return null;
    }

    const creerProfesseur = db.transactionAsync(async(tx, nom, matiere, classe, codeAcces) => {
        const userStmt = await tx.prepare('INSERT INTO users (name, role, code_acces) VALUES (?, ?, ?)');
        const userResult = await userStmt.run(nom, 'professeur', codeAcces);

        const teacherStmt = await tx.prepare('INSERT INTO teachers (user_id, nom, matiere, classe) VALUES (?, ?, ?, ?)');
        const result = await teacherStmt.run(userResult.lastInsertRowid, nom, matiere, classe);

        return result.lastInsertRowid;
    });

    try {
        const teacherId = await creerProfesseur(nom, matiere, classe, codeAcces);
        logInfo(`Professeur ajoute : ${nom} - ${matiere} - Classe ${classe}`);
        return teacherId;
    } catch (err) {
        logWarning(`Echec ajout professeur ${nom} : ${err.message}`);
        return null;
    }
}

async function modifierProfesseur(id, champs) {
    const { nom, matiere, classe } = champs;
    if (!NonVide(nom) || !NonVide(matiere) || !NonVide(classe)) {
        logWarning(`Champs invalides pour modification professeur : id ${id}`);
        return false;
    }

    const profStmt = await db.prepare('SELECT user_id FROM teachers WHERE id = ?');
    const prof = await profStmt.get(id);
    if (!prof) {
        logWarning(`Professeur introuvable pour modification : id ${id}`);
        return false;
    }

    const modifier = db.transactionAsync(async(tx, id, userId) => {
        const s1 = await tx.prepare('UPDATE teachers SET nom = ?, matiere = ?, classe = ? WHERE id = ?');
        await s1.run(nom, matiere, classe, id);
        const s2 = await tx.prepare('UPDATE users SET name = ? WHERE id = ?');
        await s2.run(nom, userId);
    });

    try {
        await modifier(id, prof.user_id);
        logInfo(`Professeur modifie : id ${id}`);
        return true;
    } catch (err) {
        logWarning(`Echec modification professeur ${id} : ${err.message}`);
        return false;
    }
}

async function supprimerProfesseur(id) {
    const profStmt = await db.prepare('SELECT user_id FROM teachers WHERE id = ?');
    const prof = await profStmt.get(id);
    if (!prof) {
        logWarning(`Professeur introuvable pour suppression : id ${id}`);
        return null;
    }

    const supprimer = db.transactionAsync(async(tx, id, userId) => {
        const s1 = await tx.prepare('DELETE FROM teachers WHERE id = ?');
        await s1.run(id);
        const s2 = await tx.prepare('DELETE FROM users WHERE id = ?');
        await s2.run(userId);
    });

    try {
        await supprimer(id, prof.user_id);
        logInfo(`Professeur supprime : id ${id}`);
        return true;
    } catch (err) {
        logWarning(`Suppression professeur ${id} impossible : ${err.message}`);
        return false;
    }
}

async function rechercherProfesseur(id) {
    try {
        const stmt = await db.prepare('SELECT id, user_id, nom, matiere, classe FROM teachers WHERE id = ?');
        return await stmt.get(id);
    } catch (err) {
        logWarning(`Echec recherche professeur ${id} : ${err.message}`);
        return null;
    }
}

async function listerProfesseurs() {
    try {
        const stmt = await db.prepare('SELECT id, user_id, nom, matiere, classe FROM teachers');
        return await stmt.all();
    } catch (err) {
        logWarning(`Echec liste professeurs : ${err.message}`);
        return [];
    }
}

async function getProfesseurParUserId(userId) {
    try {
        const stmt = await db.prepare('SELECT id, user_id, nom, matiere, classe FROM teachers WHERE user_id = ?');
        return await stmt.get(userId);
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