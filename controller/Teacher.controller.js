const {
    ajouterProfesseur,
    modifierProfesseur,
    supprimerProfesseur,
    rechercherProfesseur,
    listerProfesseurs
} = require('../services/teacherServices.js');

function creer(req, res) {
    const { nom, matiere, classe, codeAcces } = req.body;
    const id = ajouterProfesseur(nom, matiere, classe, codeAcces);
    if (!id) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    res.status(201).json({ message: 'Professeur ajoute.', id });
}

function modifier(req, res) {
    const succes = modifierProfesseur(req.params.id, req.body);
    if (!succes) {
        return res.status(400).json({ error: 'Champs invalides ou professeur introuvable' });
    }
    res.json({ message: 'Professeur modifie.' });
}

function supprimer(req, res) {
    const succes = supprimerProfesseur(req.params.id);
    if (succes === null) {
        return res.status(404).json({ error: 'Professeur introuvable.' });
    }
    if (!succes) {
        return res.status(409).json({ error: 'Suppression impossible : encore affecte a une matiere.' });
    }
    res.json({ message: 'Professeur supprime.' });
}

function rechercher(req, res) {
    const prof = rechercherProfesseur(req.params.id);
    if (!prof) {
        return res.status(404).json({ error: 'Professeur introuvable.' });
    }
    res.json(prof);
}

function lister(req, res) {
    res.json(listerProfesseurs());
}

module.exports = { creer, modifier, supprimer, rechercher, lister };