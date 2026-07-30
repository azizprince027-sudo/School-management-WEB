const express = require('express');
const authrouter = express.Router();

const authControlleur = require('../controller/auth.controller');

authrouter.post('/inscriptions', authControlleur.inscriptions);
authrouter.post('/connexion', authControlleur.connexion);

module.exports = authrouter;