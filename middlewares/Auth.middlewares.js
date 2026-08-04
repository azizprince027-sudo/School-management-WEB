// Middleware qui verifie que l'utilisateur est bien connecte (session active)
function estConnecte(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Non authentifie. Veuillez vous connecter.' });
    }
    next();
}

// Middleware "factory" : renvoie un middleware qui autorise uniquement les roles passes en argument
// Utilisation : router.get('/route', estConnecte, autoriserRoles('admin'), controller)
function autoriserRoles(...rolesAutorises) {
    return (req, res, next) => {
        if (!req.session || !req.session.user || !rolesAutorises.includes(req.session.user.role)) {
            return res.status(403).json({ error: 'Acces refuse : role insuffisant.' });
        }
        next();
    };
}

module.exports = { estConnecte, autoriserRoles };