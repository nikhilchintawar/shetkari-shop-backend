const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");


const signup = (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            console.log(err)
            return res.status(400).json({
                err: "not able to save user in db."
            })
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            postalAddress: user.postalAddress,
            role: user.role,
            id: user._id

        })
    })
}

const signin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    User.findOne({ email }, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                err: "email does not exist, please enter valid email address."
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                err: "email and password does not exist."
            })
        }
        //created token
        const token = jwt.sign({_id: user}, process.env.SECRET)
        //put token in cookie
        res.cookie("token", token, {expire: new Date() + 300})
        //send response to frontend
        const { _id, firstName, lastName, email, role } = user;
        return res.json({ token, user: { _id, firstName, lastName, email, role }})
    })
}

const signOut = (req, res) => {
    res.clearCookie('token')
    res.json({
        message: "signed out successfully."
    });
}

//protected route
const isSignedIn = expressjwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middleware
const isAuthenticated = (req, res, next,err) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        console.log(err)
        return res.status(403).json({
            err: "access denied."
        })
    }
    next();
}

const isFarmer = (req, res, next, err) => {
  
    if(req.profile.role === 0){ 
        res.status(403).json({
            err: "only admin access."
        })
    }
    next();
}

module.exports =({
    signup,
    signin, 
    signOut,
    isSignedIn,
    isAuthenticated,
    isFarmer
})