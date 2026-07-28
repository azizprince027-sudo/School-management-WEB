const express = require('express');
const authrouter = express.Router();
const {AUTHcontrolleur} = require('../controllers/auth.controller.js');

authrouter.post('/inscriptions', AUTHcontrolleur.inscriptions);
authrouter.post('/connexion', AUTHcontrolleur.connexion);

module.exports = {
    authrouter
};


