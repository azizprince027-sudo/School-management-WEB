const { ajouterEtudiant, modifierEtudiant, supprimerEtudiant, rechercherEtudiant, listerEtudiants } = require('../services/studentServices.js');

async function creer(req, res) {
    const { matricule, nom, prenom, age, classe } = req.body;
    if (!matricule || !nom || !prenom || age === undefined || age === null || age === '' || !classe) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const succes = await ajouterEtudiant(matricule, nom, prenom, age, classe);
    if (!succes) return res.status(409).json({ error: 'Ce matricule est deja utilise.' });
    res.status(201).json({ message: 'Etudiant ajoute.' });
}

async function modifier(req, res) {
    const succes = await modifierEtudiant(req.params.matricule, req.body);
    if (!succes) return res.status(400).json({ error: 'Champs invalides ou etudiant introuvable.' });
    res.json({ message: 'Etudiant modifie.' });
}

async function supprimer(req, res) {
    const succes = await supprimerEtudiant(req.params.matricule);
    if (succes === null) return res.status(404).json({ error: 'Etudiant introuvable.' });
    if (!succes) return res.status(409).json({ error: 'Suppression Impossible: des notes sont encore liees a cet etudiant.' });
    res.json({ message: 'Etudiant supprime.' });
}

async function rechercher(req, res) {
    const etudiant = await rechercherEtudiant(req.params.matricule);
    if (!etudiant) return res.status(404).json({ error: 'Etudiant introuvable.' });
    res.json(etudiant);
}

async function lister(req, res) {
    const classe = req.query.classe || null;
    res.json(await listerEtudiants(classe));
}

module.exports = { creer, modifier, supprimer, rechercher, lister };