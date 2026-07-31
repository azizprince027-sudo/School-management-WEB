const {
    ajouterNote,
    modifierNote,
    supprimerNote,
    moyenneEtudiant,
    notesEtudiant
} = require('../services/gradeServices.js');

function creer(req, res) {
    const { studentId, subjectId, note } = req.body;
    const succes = ajouterNote(studentId, subjectId, note);
    if (!succes) {
        return res.status(400).json({ error: 'Note invalide (0-20) ou matiere introuvable.' });
    }
    res.status(201).json({ message: 'Note ajoutee.' });
}

function modifier(req, res) {
    const succes = modifierNote(req.params.id, req.body.note);
    if (!succes) {
        return res.status(400).json({ error: 'Note invalide ou introuvable.' });
    }
    res.json({ message: 'Note modifiee.' });
}

function supprimer(req, res) {
    const succes = supprimerNote(req.params.id);
    if (!succes) {
        return res.status(404).json({ error: 'Note introuvable.' });
    }
    res.json({ message: 'Note supprimee.' });
}

function moyenne(req, res) {
    res.json({ moyenne: moyenneEtudiant(req.params.studentId) });
}

function notes(req, res) {
    res.json(notesEtudiant(req.params.studentId));
}

module.exports = { creer, modifier, supprimer, moyenne, notes };