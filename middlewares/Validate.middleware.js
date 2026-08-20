// Petit middleware generique pour verifier que des champs obligatoires sont presents dans req.body.
// Utilisation : validerChamps('nom', 'prenom', 'age')

function validerChamps(...champsRequis) {
    return (req, res, next) => {
        const manquants = champsRequis.filter(champ => {
            const valeur = req.body[champ];
            return valeur === undefined || valeur === null || valeur === '';
        });
        if (manquants.length > 0) {
            return res.status(400).json({ error: `Champs manquants : ${manquants.join(', ')}` });
        }
        next();
    };
}

module.exports = { validerChamps };