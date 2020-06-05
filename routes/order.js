const express = require("express");
const router = express.Router();


const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/order");
const { isSignedIn, isAuthenticated, isFarmer } = require("../controllers/auth");
const { updateStock } = require("../controllers/product");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");

//params
router.param("userId", getUserById)
router.param("orderId", getOrderById)

router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder )
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isFarmer, getAllOrders)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isFarmer, updateOrderStatus)