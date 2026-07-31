const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stats.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/auth.middleware.js');

router.use(estConnecte, autoriserRoles('admin', 'professeur'));

router.get('/meilleur/:classe', ctrl.meilleur);
router.get('/moyenne/:classe', ctrl.moyenneClasse);
router.get('/absences/:date', ctrl.absencesJour);

module.exports = router;