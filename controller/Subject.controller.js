const {
    ajouterMatiere,
    affecterProfesseur,
    listerMatieres,
    supprimerMatiere
} = require('../services/subjectServices.js');

function creer(req, res) {
    const { nom, teacherId } = req.body;
    const id = ajouterMatiere(nom, teacherId || null);
    if (!id) {
        return res.status(400).json({ error: 'Le nom de la matiere est requis.' });
    }
    res.status(201).json({ message: 'Matiere ajoutee.', id });
}

function affecter(req, res) {
    const { teacherId } = req.body;
    const succes = affecterProfesseur(req.params.id, teacherId);
    if (!succes) {
        return res.status(400).json({ error: 'Affectation impossible (matiere ou professeur introuvable).' });
    }
    res.json({ message: 'Professeur affecte a la matiere.' });
}

function lister(req, res) {
    res.json(listerMatieres());
}

function supprimer(req, res) {
    const succes = supprimerMatiere(req.params.id);
    if (!succes) {
        return res.status(409).json({ error: 'Suppression impossible (notes liees a cette matiere).' });
    }
    res.json({ message: 'Matiere supprimee.' });
}

module.exports = { creer, affecter, lister, supprimer };