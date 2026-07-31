const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/teacher.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/auth.middleware.js');
const { validerChamps } = require('../middlewares/validate.middleware.js');

router.use(estConnecte);

router.get('/', autoriserRoles('admin'), ctrl.lister);
router.get('/:id', autoriserRoles('admin'), ctrl.rechercher);
router.post('/', autoriserRoles('admin'), validerChamps('nom', 'matiere', 'classe', 'codeAcces'), ctrl.creer);
router.put('/:id', autoriserRoles('admin'), ctrl.modifier);
router.delete('/:id', autoriserRoles('admin'), ctrl.supprimer);

module.exports = router;