// Middleware "factory" : renvoie un middleware qui autorise uniquement les roles passes en argument
// Utilisation : router.get('/route', authMiddleware, checkRole('admin'), controller)
function checkRole(...rolesAutorises) {
    return (req, res, next) => {
        if (!req.user || !rolesAutorises.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acces refuse : role insuffisant.' });
        }
        next();
    };
}

module.exports = {checkRole};