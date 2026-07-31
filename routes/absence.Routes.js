const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/absence.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/auth.middleware.js');

router.use(estConnecte);

router.post('/', autoriserRoles('admin', 'professeur'), ctrl.creer);
router.put('/:id', autoriserRoles('admin', 'professeur'), ctrl.marquer);
router.get('/etudiant/:studentId', autoriserRoles('admin', 'professeur', 'étudiant'), ctrl.historiqueEleve);
router.get('/classe/:classe', autoriserRoles('admin', 'professeur'), ctrl.historiquePourClasse);

module.exports = router;