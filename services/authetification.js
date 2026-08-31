const db = require('../db/database.js');
const { logInfo, logWarning } = require('../utils/logger.js');

async function loginUser(name, codeAcces, role) {
    name = name ? name.trim() : null;
    codeAcces = codeAcces ? codeAcces.trim() : null;
    role = role ? role.trim() : null;

    try {
        const stmt = await db.prepare(
            'SELECT * FROM users WHERE name = ? AND code_acces = ? AND role = ?'
        );
        const user = await stmt.get([name, codeAcces, role]);

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

async function loginStudent(matricule) {
    matricule = matricule ? matricule.trim() : null;
    try {
        const stmt = await db.prepare('SELECT * FROM students WHERE matricule = ?');
        const student = await stmt.get([matricule]);

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