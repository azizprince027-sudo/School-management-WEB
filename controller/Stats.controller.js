const { meilleurEtudiant, moyenneGeneraleClasse, compterAbsencesJour } = require('../services/meilleursEtudian.js');

async function meilleur(req, res) {
    const result = await meilleurEtudiant(req.params.classe);
    if (!result) return res.status(404).json({ error: 'Aucune donnee pour cette classe.' });
    res.json(result);
}

async function moyenneClasse(req, res) {
    res.json({ moyenne: await moyenneGeneraleClasse(req.params.classe) });
}

async function absencesJour(req, res) {
    const { date } = req.params;
    const { classe } = req.query;
    res.json({ total: await compterAbsencesJour(date, classe || null) });
}

module.exports = { meilleur, moyenneClasse, absencesJour };