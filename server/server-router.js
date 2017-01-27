const express = require('express');

const authenticationController = require('./authentication-controller');
const itemsController = require('./items-controller');

const router = express.Router();

router.post('/user-register', authenticationController.register);
router.post('/user-login',    authenticationController.login);
router.post('/items-list',    itemsController.itemsList);

module.exports = router;
