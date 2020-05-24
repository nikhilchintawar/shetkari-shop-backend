const express = require("express");
const router = express.Router();

const {getProductId, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/product');
const {isSignedIn, isAuthenticated} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');

router.param('/productId', getProductId);
router.param('/userId', getUserById);

router.get('/product/:productId', getProduct);
router.post('/product/:userId/create', isSignedIn, isAuthenticated, createProduct);
router.put('/user/:userId/product/:productId', isSignedIn, isAuthenticated, updateProduct);
router.delete('/user/:userId/product/:productId', isSignedIn, isAuthenticated, deleteProduct)

module.exports = router;

//work on farmer authentication and category is remained