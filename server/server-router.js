const express = require('express');

const authenticationController = require('./authentication-controller');
const itemsController = require('./items-controller');

const router = express.Router();

router.post('/user-register', authenticationController.register);
router.post('/user-login',    authenticationController.login);
router.post('/user-logout',   authenticationController.logout);
router.post('/items-list',    authenticationController.authenticateRequest, itemsController.itemsList);
router.post('/item-prices',   authenticationController.authenticateRequest, itemsController.itemPrices);

module.exports = router;
