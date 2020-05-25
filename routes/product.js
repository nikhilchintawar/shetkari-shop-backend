const express = require("express");
const router = express.Router();

const {getProductId, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/product');
const {isSignedIn, isAuthenticated, isFarmer} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');

router.param('/productId', getProductId);
router.param('/userId', getUserById);

router.get('/product/:productId', getProduct);
router.post('/user/:userId/product/create', isSignedIn, isAuthenticated, isFarmer, createProduct);
router.put('/user/:userId/product/:productId', isSignedIn, isAuthenticated, isFarmer, updateProduct);
router.delete('/user/:userId/product/:productId', isSignedIn, isAuthenticated, isFarmer, deleteProduct)

module.exports = router;

