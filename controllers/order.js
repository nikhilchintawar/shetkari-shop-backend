const { Order, ProductCart } = require("../models/order");


const getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name proce")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                err: "No order found in db"
            })
        }
        req.order = order
        next()
    })
}

const createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                err: "failed to save your order in db"
            })
        }
        res.json(order)
    })
}

const getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
        if(err){
            return res.status(400).json({
                err: "no orders availabel"
            })
        }
        res.json(orders)
    })
}

const updateOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    err: "cannot update order status"
                })
            }
            res.json(order)
        })
}

module.exports = ({
    createOrder,
    getOrderById, 
    getAllOrders,
    updateOrderStatus
})