const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Auth.controller.js');
const { estConnecte } = require('../middlewares/Auth.middlewares.js');

router.post('/login', ctrl.connexionPersonnel); // admin / professeur
router.post('/login-etudiant', ctrl.connexionEtudiant); // etudiant
router.post('/logout', estConnecte, ctrl.deconnexion); // deconnexion de l'utilisateur connecté
router.get('/profil', estConnecte, ctrl.profil); // Récupère les informations de l'utilisateur connecté

module.exports = router;