const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Auth.controller.js');
const { estConnecte } = require('../middlewares/Auth.middlewares.js');

router.post('/login', ctrl.connexionPersonnel); // admin / professeur
router.post('/login-etudiant', ctrl.connexionEtudiant); // etudiant
router.post('/logout', estConnecte, ctrl.deconnexion);
router.get('/profil', estConnecte, ctrl.profil);

module.exports = router;