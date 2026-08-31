const { loginUser, loginStudent } = require('../services/authetification.js');

async function connexionPersonnel(req, res) {
    const { name, codeAcces, role } = req.body;
    if (!name || !codeAcces || !role) {
        return res.status(400).json({ error: 'identifiants invalides.' });
    }
    const user = await loginUser(name, codeAcces, role);
    if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects.' });
    }
    req.session.user = { id: user.id, name: user.name, role: user.role };
    res.json({ message: 'Connexion reussie.', user: req.session.user });
}

async function connexionEtudiant(req, res) {
    const { matricule } = req.body;
    if (!matricule) {
        return res.status(400).json({ error: 'matricule requis.' });
    }
    const student = await loginStudent(matricule);
    if (!student) {
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
    res.json({ message: 'Connexion reussie.', user: req.session.user });
}

function deconnexion(req, res) {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la deconnexion.' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Deconnexion reussie , Travaille bien .' });
    });
}

function profil(req, res) {
    res.json({ user: req.session.user });
}

module.exports = { connexionPersonnel, connexionEtudiant, deconnexion, profil };