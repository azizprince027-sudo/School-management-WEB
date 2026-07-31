const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Subject.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/Auth.middlewares.js');

router.use(estConnecte);

router.get('/', ctrl.lister); // accessible a tous les roles connectes
router.post('/', autoriserRoles('admin'), ctrl.creer);
router.put('/:id/affecter', autoriserRoles('admin'), ctrl.affecter);
router.delete('/:id', autoriserRoles('admin'), ctrl.supprimer);

module.exports = router;