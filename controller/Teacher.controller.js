const { ajouterProfesseur, modifierProfesseur, supprimerProfesseur, rechercherProfesseur, listerProfesseurs, getProfesseurParUserId } = require('../services/teacherServices.js');
// Controller pour gérer les requêtes liées aux professeurs

async function monProfil(req, res) {
    const prof = await getProfesseurParUserId(req.session.user.id);
    if (!prof) {
        return res.status(404).json({ error: 'Profil professeur introuvable.' });
    }
    res.json(prof);
}

async function creer(req, res) {
    const { nom, matiere, classe, codeAcces } = req.body;
    const id = await ajouterProfesseur(nom, matiere, classe, codeAcces);
    if (!id) return res.status(400).json({ error: 'Tous les champs sont requis.' });
    res.status(201).json({ message: 'Professeur ajoute.', id });
}

async function modifier(req, res) {
    const succes = await modifierProfesseur(req.params.id, req.body);
    if (!succes) return res.status(400).json({ error: 'Champs invalides ou professeur introuvable' });
    res.json({ message: 'Professeur modifie.' });
}

async function supprimer(req, res) {
    const succes = await supprimerProfesseur(req.params.id);
    if (succes === null) return res.status(404).json({ error: 'Professeur introuvable.' });
    if (!succes) return res.status(409).json({ error: 'Suppression impossible : encore affecte a une matiere.' });
    res.json({ message: 'Professeur supprime.' });
}

async function rechercher(req, res) {
    const prof = await rechercherProfesseur(req.params.id);
    if (!prof) return res.status(404).json({ error: 'Professeur introuvable.' });
    res.json(prof);
}

async function lister(req, res) {
    res.json(await listerProfesseurs());
}

module.exports = { creer, modifier, supprimer, rechercher, lister, monProfil };