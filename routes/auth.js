const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const { signin, signup, signOut } = require("../controllers/auth");


router.post("/signup", [
    check('firstName', 'name should be at least 3 characters').isLength({ min:3 }),
    check('lastName', 'name should be at least 3 characters').isLength({ min:3 }),
    check('email', 'email is required').isEmail()
], signup)

router.post("/signin", [
    check('email', 'email is required').isEmail()
], signin)

router.get("/signout", signOut)

module.exports = router;
