const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const { signin, signup, signOut } = require("../controllers/auth");
const passport = require("passport");


router.post("/signup", [
    check('firstName', 'name should be at least 3 characters').isLength({ min:3 }),
    check('lastName', 'name should be at least 3 characters').isLength({ min:3 }),
    check('email', 'email is required').isEmail()
], signup)

router.post("/signin", [
    check('email', 'email is required').isEmail()
], signin)

router.get("/signout", signOut)

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/shop", 
    passport.authenticate("google", { failureRedirect: "/signin", session: false }), 
    (req, res) => {
    let token = req.user.token;
    res.redirect("http://localhost:3000?token=" + token);
})

module.exports = router;
