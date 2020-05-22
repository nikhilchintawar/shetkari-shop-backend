const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const { signin, signup, signOut } = require("../controllers/auth");


router.post("/signup", [
    check('firstName', 'name should be at least 3 characters').isLength({ min:3 }),
    check('lastName', 'name should be at least 3 characters').isLength({ min:3 }),
    check('email', 'email is required').isEmail(),
    check('password', 'password must be atleast 3 character long').isLength({ min:3 })
], signup)

router.post("/signin", [
    check('email', 'email is required').isEmail(),
    check('password', 'password must be atleast 3 character long').isLength({ min:3 })
], signin)

router.get("/signout", signOut)

module.exports = router;
