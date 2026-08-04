const express = require('express');
const router = express.Router();
const ctrl = require('../controller/User.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/Auth.middlewares.js');

router.use(estConnecte, autoriserRoles('admin'));

router.get('/', ctrl.lister);
router.post('/', ctrl.creer);
router.delete('/:id', ctrl.supprimer);

module.exports = router;