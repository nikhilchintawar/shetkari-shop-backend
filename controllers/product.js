const Product = require("../models/product");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');


const getProductId = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err){
            return res.status(400).json({
                err: 'no product found'
            })
        }
        req.product = product
        next()
    })
}


const createProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
          return res.satus(400).json({
              err: "not able to upload the image"
          })       
}
        //destructure the field
        const { name, description, price, category, stock } = fields

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: 'please include all fields'
            })
        }
        
        //todo: restrictions on field
        let product = new Product(fields)   
        //handle file
        if(file.photo){
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'file size is too big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
       product.save((err, product) =>{
            if(err){
                res.status(400).json({
                    error: 'saving tshirt in db failed'
                })
            }
            res.json(product)
        })
    })
}


const getProduct = (req, res) => {
    Product.findById(req.params.productId).exec((err, product) => {
        if(err){
            return res.status(400).json({
                err: 'no product found'
            })
        }
     res.json(product)
})
}

//bug
const updateProduct = ( req, res ) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) =>{
        if (err) {
            return res.status(400).json({
                error: 'problem with image'
            });
        }

        //updation code
        
        let product = req.product;
        product = _.extend(product, fields)
       
        //handle file
        if(file.photo){
                if (file.photo.size > 3000000) {
                    return res.status(400).json({
                        error: 'file size is too big'
                    })
                }
                product.photo.data = fs.readFileSync(file.photo.path)
                product.photo.contentType = file.photo.type
        }
        
    
        //save to db
        Product.findByIdAndUpdate(
            req.params.productId,
            {$set: product},
            (err, product) =>{
            if(err){
                console.log(err)
                res.status(400).json({
                    err: 'updation failed'
                })
            }   
            res.json(product)
        })
    })
}

//bug
const photo = (req, res) =>{
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
}



const deleteProduct = (req, res) => {
    Product.deleteOne((err, deleteProduct) => {
        if(err){
            return res.satus(400).json({
                err: "not able to delete the product"
            })
        }
        res.json({
            message: "product is deleted",
            deleteProduct
        })

    })
}

const getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'

    Product.find()
    .select('-photo')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(404).json({
                err: "no products found"
            })
        }
        res.json(products)
    })
}

const updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: {stock: -product.count, sold: +product.count}}

            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                err: "bulk operation failed"
            })
        }
        next()
    })
}

module.exports = ({
    getProductId,
    getProduct,
    createProduct,
    updateProduct,
    photo,
    deleteProduct,
    getAllProducts,
    updateStock
})