const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/auth.middleware.js');

router.use(estConnecte, autoriserRoles('admin'));

router.get('/', ctrl.lister);
router.post('/', ctrl.creer);
router.delete('/:id', ctrl.supprimer);

module.exports = router;