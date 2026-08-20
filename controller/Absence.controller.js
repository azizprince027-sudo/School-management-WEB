const {
    enregistrerAbsence,
    marquerStatut,
    historiqueEtudiant,
    historiqueClasse
} = require('../services/absenceServices.js');

function creer(req, res) {
    const { studentId, date } = req.body;
    const succes = enregistrerAbsence(studentId, date);
    if (!succes) {
        return res.status(400).json({ error: 'Date invalide.' });
    }
    res.status(201).json({ message: 'Absence enregistree.' });
}

function marquer(req, res) {
    const { status } = req.body;
    const succes = marquerStatut(req.params.id, status);
    if (!succes) {
        return res.status(404).json({ error: 'Absence introuvable.' });
    }
    res.json({ message: 'Statut mis a jour.' });
}

function historiqueEleve(req, res) {
    const { role, id } = req.session.user;
    if (role === 'etudiant' && String(id) !== String(req.params.studentId)) {
        return res.status(403).json({ error: 'Acces refuse : vous ne pouvez consulter que vos propres donnees.' });
    }
    res.json(historiqueEtudiant(req.params.studentId));
}

function historiquePourClasse(req, res) {
    res.json(historiqueClasse(req.params.classe));
}

module.exports = { creer, marquer, historiqueEleve, historiquePourClasse };