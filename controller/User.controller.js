const { ajouterUser, supprimerUser, listerUsers } = require('../services/userServices.js');

function creer(req, res) {
    const { name, role, codeAcces } = req.body;
    if (!name || !role || !codeAcces) {
        return res.status(400).json({ error: 'name, role et codeAcces sont requis.' });
    }
    const id = ajouterUser(name, role, codeAcces);
    res.status(201).json({ message: 'Utilisateur ajoute.', id });
}

function supprimer(req, res) {
    supprimerUser(req.params.id);
    res.json({ message: 'Utilisateur supprime.' });
}

function lister(req, res) {
    res.json(listerUsers());
}

module.exports = { creer, supprimer, lister };