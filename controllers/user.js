const User = require('../models/user');
const Order = require('../models/order');


const getUserById = (req, res, next, id)=> {
    User.findById(id).exec((error, user) => {
        if (error) {
            return res.status(400).json({
                error: 'no user is found in db'
            })
        }
        req.profile = user
        next()
    })
};

const getUser = (req, res) =>{

    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    console.log(req.profile)
    return res.json(req.profile)
}

const updateUser = (req, res) =>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (error, user) => {
            if (error) {
                return res.status(400).json({
                    error: "you are not authorized to update the user"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined
            res.json(user)
        }
    )
}

const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.userId).exec((error, deletedUser) => {
        if (error) {
            res.status(400).json({
                error: "Not able to delete the user."
            })
        }
        res.json({
            message: "User is deleted",
            deletedUser
        })
    });
};

const userPurchaseList = (req,res) =>{
    Order.find({user: req.profile._id})
    .populate("user", "_id firstName lastName")
    .exec((error, order) =>{
        if (error) {
            return res.status(400).json({
                error: "no order by this user"
            })
        }
        return res.json(order)
    })
}
const pushOrderInPurchaseList = (req, res, next) =>{
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    //store this in db
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (error, purchases) => {
            if(error){
                return res.status(400).json({
                    error: 'unable to save purchase list'
                })
            }
            next()
        } 
        )
   
}

module.exports = ({
    getUserById,
    getUser,
    updateUser,
    userPurchaseList,
    pushOrderInPurchaseList,
    deleteUser
})