const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Stats.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/Auth.middlewares.js');

router.use(estConnecte, autoriserRoles('admin', 'professeur', 'etudiant'));

router.get('/meilleur/:classe', ctrl.meilleur);
router.get('/moyenne/:classe', ctrl.moyenneClasse);
router.get('/absences/:date', ctrl.absencesJour);

module.exports = router;