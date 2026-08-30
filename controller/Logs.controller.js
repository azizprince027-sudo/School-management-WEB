const { lireLogs } = require('../utils/logger.js');

function lister(req, res) {
    const limite = Number(req.query.limite) || 20;
    res.json(lireLogs(limite));
}

module.exports = { lister };