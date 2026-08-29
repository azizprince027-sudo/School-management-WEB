const { loginUser, loginStudent } = require('../services/authetification.js');
const { logInfo, logWarning } = require('../utils/logger.js');

async function connexionPersonnel(req, res) {
    const { name, codeAcces, role } = req.body;
    if (!name || !codeAcces || !role) {
        logWarning('Tentative de connexion echouee : nom, codeAcces et role requis.');
        return res.status(400).json({ error: 'identifiants invalides.' });
    }
    const user = await loginUser(name, codeAcces, role);
    if (!user) {
        logWarning('Tentative de connexion echouee : identifiants incorrects.');
        return res.status(401).json({ error: 'Identifiants incorrects.' });
    }
    req.session.user = { id: user.id, name: user.name, role: user.role };
    logInfo(`Connexion reussie : ${user.role} ${user.name}`);
    res.json({ message: 'Connexion reussie.', user: req.session.user });
}

async function connexionEtudiant(req, res) {
    const { matricule } = req.body;
    if (!matricule) {
        logWarning('Tentative de connexion echouee : matricule requis.');
        return res.status(400).json({ error: 'matricule requis.' });
    }
    const student = await loginStudent(matricule);
    if (!student) {
        logWarning('Tentative de connexion echouee : matricule inconnu.');
        return res.status(401).json({ error: 'Matricule inconnu.' });
    }
    req.session.user = {
        id: student.id,
        matricule: student.matricule,
        role: 'etudiant',
        nom: student.nom,
        prenom: student.prenom,
        classe: student.classe
    };
    logInfo(`Connexion reussie : étudiant ${student.nom} ${student.prenom}`);
    res.json({ message: 'Connexion reussie.', user: req.session.user });
}

function deconnexion(req, res) {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la deconnexion.' });
        res.clearCookie('connect.sid');
        logInfo('Deconnexion reussie.');
        res.json({ message: 'Deconnexion reussie , Travaille bien .' });
    });
}

function profil(req, res) {
    res.json({ user: req.session.user });
}

module.exports = { connexionPersonnel, connexionEtudiant, deconnexion, profil };