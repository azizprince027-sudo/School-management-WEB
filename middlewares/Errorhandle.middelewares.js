
// Middleware appele quand aucune route ne correspond
function notFoundHandler(req, res, next) {
    res.status(404).json({ error: `Route introuvable : ${req.method} ${req.originalUrl}` });
}

// Middleware global de gestion des erreurs (doit avoir 4 parametres pour qu'Express le reconnaisse)
function errorHandler(err, req, res, next) {
    console.error(err.stack || err);
    res.status(err.status || 500).json({ error: err.message || 'Erreur interne du serveur.' });
}

module.exports = { notFoundHandler, errorHandler };