const {
    meilleurEtudiant,
    moyenneGeneraleClasse,
    compterAbsencesJour
} = require('../services/meilleursEtudian.js');

function meilleur(req, res) {
    const result = meilleurEtudiant(req.params.classe);
    if (!result) {
        return res.status(404).json({ error: 'Aucune donnee pour cette classe.' });
    }
    res.json(result);
}

function moyenneClasse(req, res) {
    res.json({ moyenne: moyenneGeneraleClasse(req.params.classe) });
}

function absencesJour(req, res) {
    const { date } = req.params;
    const { classe } = req.query;
    res.json({ total: compterAbsencesJour(date, classe || null) });
}

module.exports = { meilleur, moyenneClasse, absencesJour };