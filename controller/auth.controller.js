const { loginUser, loginStudent } = require('../services/authetification.js');

// Connexion admin / professeur (nom + code d'acces + role)
function connexionPersonnel(req, res) {
    const { name, codeAcces, role } = req.body;
    if (!name || !codeAcces || !role) {
        return res.status(400).json({ error: 'nom, codeAcces et role sont requis.' });
    }
    const user = loginUser(name, codeAcces, role);
    if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects.' });
    }
    req.session.user = { id: user.id, name: user.name, role: user.role };
    res.json({ message: 'Connexion reussie.', user: req.session.user });
}

// Connexion etudiant (matricule uniquement)
function connexionEtudiant(req, res) {
    const { matricule } = req.body;
    if (!matricule) {
        return res.status(400).json({ error: 'matricule requis.' });
    }
    const student = loginStudent(matricule);
    if (!student) {
        return res.status(401).json({ error: 'Matricule inconnu.' });
    }
    req.session.user = {
        id: student.id,
        matricule: student.matricule,
        role: 'étudiant',
        nom: student.nom,
        prenom: student.prenom,
        classe: student.classe
    };
    res.json({ message: 'Connexion reussie.', user: req.session.user });
}

function deconnexion(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la deconnexion.' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Deconnexion reussie , a bientot .' });
    });
}

function profil(req, res) {
    res.json({ user: req.session.user });
}

module.exports = { connexionPersonnel, connexionEtudiant, deconnexion, profil };