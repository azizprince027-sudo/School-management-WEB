const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');
// Connexion admin ou professeur via nom + code d'acces
function loginUser(name, codeAcces, role) {
    try {
        const user = db.prepare(
            'SELECT * FROM users WHERE name = ? AND code_acces = ? AND role = ?'
        ).get(name, codeAcces, role);

        if (!user) {
            logWarning(`Tentative de connexion echouee pour ${name}`);
            return null;
        }

        logInfo(`Connexion reussite : ${user.role} ${user.name}`);
        return user;
    } catch (err) {
        logWarning(`Erreur lors de la connexion pour ${name} : ${err.message}`);
        return null;
    }
}
// La fonction "loginUser" est utilisée pour authentifier un utilisateur (admin ou professeur) en vérifiant son nom et son code d'accès dans la base de données. Elle utilise une requête SQL préparée pour sélectionner l'utilisateur correspondant aux informations fournies. Si l'utilisateur est trouvé, un message de connexion réussie est enregistré dans le journal, et l'objet utilisateur est retourné. Si l'utilisateur n'est pas trouvé, un message d'avertissement est enregistré, et la fonction retourne null pour indiquer que la connexion a échoué.

// Connexion etudiant via matricule uniquement
function loginStudent(matricule) {
    try {
        const student = db.prepare(
        'SELECT * FROM students WHERE matricule = ?'
        ).get(matricule);

        if (!student) {
            logWarning(`Matricule inconnu : ${matricule}`);
            return null;
        }

        logInfo(`Connexion etudiant reussite : ${student.matricule}`);
        return student;
    } catch (err) {
        logWarning(`Erreur lors de la connexion pour ${matricule} : ${err.message}`);
        return null;
    }
}
module.exports = { loginUser, loginStudent };