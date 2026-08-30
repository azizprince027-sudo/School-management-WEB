const express = require('express');
const router = express.Router();
const ctrl = require('../controller/Logs.controller.js');
const { estConnecte, autoriserRoles } = require('../middlewares/Auth.middlewares.js');

router.get('/', estConnecte, autoriserRoles('admin'), ctrl.lister);

module.exports = router;