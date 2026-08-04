const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Student.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/Auth.middlewares.js');
const { validerChamps } = require('../middlewares/Validate.middleware.js');

router.use(estConnecte);

router.get('/', autoriserRoles('admin', 'professeur'), ctrl.lister);
router.get('/:matricule', autoriserRoles('admin', 'professeur'), ctrl.rechercher);
router.post('/', autoriserRoles('admin'), validerChamps('matricule', 'nom', 'prenom', 'age', 'classe'), ctrl.creer);
router.put('/:matricule', autoriserRoles('admin'), ctrl.modifier);
router.delete('/:matricule', autoriserRoles('admin'), ctrl.supprimer);

module.exports = router;