const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Grade.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/Auth.middlewares.js');

router.use(estConnecte);

router.post('/', autoriserRoles('admin', 'professeur'), ctrl.creer);
router.put('/:id', autoriserRoles('admin', 'professeur'), ctrl.modifier);
router.delete('/:id', autoriserRoles('admin', 'professeur'), ctrl.supprimer);
router.get('/etudiant/:studentId', autoriserRoles('admin', 'professeur', 'etudiant'), ctrl.notes);
router.get('/etudiant/:studentId/moyenne', autoriserRoles('admin', 'professeur', 'etudiant'), ctrl.moyenne);

module.exports = router;