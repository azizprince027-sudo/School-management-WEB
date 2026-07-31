const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller.js');
const { estConnecte } = require('../middlewares/auth.middleware.js');

router.post('/login', ctrl.connexionPersonnel); // admin / professeur
router.post('/login-etudiant', ctrl.connexionEtudiant); // etudiant
router.post('/logout', estConnecte, ctrl.deconnexion);
router.get('/profil', estConnecte, ctrl.profil);

module.exports = router;