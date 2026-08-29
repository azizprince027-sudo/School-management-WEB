const { ajouterUser, supprimerUser, listerUsers } = require('../services/userServices.js');

async function creer(req, res) {
    const { name, role, codeAcces } = req.body;
    if (!name || !role || !codeAcces) return res.status(400).json({ error: 'name, role et codeAcces sont requis.' });
    const id = await ajouterUser(name, role, codeAcces);
    if (!id) return res.status(400).json({ error: 'Creation impossible (role invalide ).' });
    res.status(201).json({ message: 'Utilisateur ajoute.', id });
}

async function supprimer(req, res) {
    const succes = await supprimerUser(req.params.id);
    if (!succes) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({ message: 'Utilisateur supprime.' });
}

async function lister(req, res) {
    res.json(await listerUsers());
}

module.exports = { creer, supprimer, lister };