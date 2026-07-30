const jwt = require('jsonwebtoken');

// Verifie la presence et la validite du token JWT dans le header Authorization
// Format attendu : "Authorization: Bearer <token>"
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // decode le token et verifie sa signature grace a la cle secrete du .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, name/matricule } accessible dans tous les controllers suivants
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalide ou expire.' });
    }
}

module.exports = {authMiddleware};