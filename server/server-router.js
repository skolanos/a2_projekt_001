const express = require('express');

const authenticationController = require('./authentication-controller');
const itemsController = require('./items-controller');
const cartController = require('./cart-controller');

const router = express.Router();

router.post('/user-register',         authenticationController.register);
router.post('/user-login',            authenticationController.login);
router.post('/user-logout',           authenticationController.logout);
router.post('/categories-list',       authenticationController.authenticateRequest, itemsController.categoriesList);
router.post('/items-list',            authenticationController.authenticateRequest, itemsController.itemsList);
router.post('/item-prices',           authenticationController.authenticateRequest, itemsController.itemPrices);
router.post('/item-add-to-cart',      authenticationController.authenticateRequest, itemsController.itemAddToCart);
router.post('/cart-number-of-items',  authenticationController.authenticateRequest, cartController.cartNumberOfItems);
router.post('/cart-items-list',       authenticationController.authenticateRequest, cartController.cartItemsList);
router.post('/cart-delete-item',      authenticationController.authenticateRequest, cartController.cartDeleteItem);
router.post('/cart-delete-all-items', authenticationController.authenticateRequest, cartController.cartDeleteAllItems);

module.exports = router;
