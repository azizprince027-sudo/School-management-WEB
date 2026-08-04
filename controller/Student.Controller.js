const {
    ajouterEtudiant,
    modifierEtudiant,
    supprimerEtudiant,
    rechercherEtudiant,
    listerEtudiants
} = require('../services/studentServices.js');

function creer(req, res) {
    const { matricule, nom, prenom, age, classe } = req.body;
    if (!matricule || !nom || !prenom || !age || !classe) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const succes = ajouterEtudiant(matricule, nom, prenom, age, classe);
    if (!succes) {
        return res.status(409).json({ error: 'Ce matricule est deja utilise.' });
    }
    res.status(201).json({ message: 'Etudiant ajoute.' });
}

function modifier(req, res) {
    const succes = modifierEtudiant(req.params.matricule, req.body);
    if (!succes) {
        return res.status(400).json({ error: 'Champs invalides ou etudiant introuvable.' });
    }
    res.json({ message: 'Etudiant modifie.' });
}

function supprimer(req, res) {
    const succes = supprimerEtudiant(req.params.matricule);
    if (!succes) {
        return res.status(409).json({ error: 'Suppression impossible (notes/absences liees).' });
    }
    res.json({ message: 'Etudiant supprime.' });
}

function rechercher(req, res) {
    const etudiant = rechercherEtudiant(req.params.matricule);
    if (!etudiant) {
        return res.status(404).json({ error: 'Etudiant introuvable.' });
    }
    res.json(etudiant);
}

function lister(req, res) {
    const classe = req.query.classe || null;
    res.json(listerEtudiants(classe));
}

module.exports = { creer, modifier, supprimer, rechercher, lister };