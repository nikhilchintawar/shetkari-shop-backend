const Product = require("../models/product");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');


const getProductId = (req, res, next, id) => {
    Product.findById(id).exec((error, product) => {
        if(error){
            return res.status(400).json({
                error: 'no product found'
            })
        }
        req.product = product;
        next();
    });
}


const createProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (error, fields, file) => {
        if (error) {
          return res.satus(400).json({
              error: "not able to upload the image"
          })       
}
        //destructure the field
        const { name, description, price, category, stock } = fields

        //restrictions on field
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: 'please include all fields'
            })
        }
        
        let product = new Product(fields)   
        //handle file
        if(file.photo){
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'file size is too big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)//full path of file
            product.photo.contentType = file.photo.type
        }

        //save to db
       product.save((error, product) =>{
            if(error){
                res.status(400).json({
                    error: 'saving in db failed'
                })
            }
            res.json(product)
        })
    })
}


const getProduct = (req, res) => {

    Product.findById(req.params.productId).exec((error, product) => {
        if(error){
            return res.status(400).json({
                error: 'no product found'
            })
        }
        req.product.photo = undefined;
        return res.json(product)
})
}


const updateProduct = (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (error, fields, file) =>{
        if (error) {
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
            (error, product) =>{
            if(error){
                console.log(error)
                res.status(400).json({
                    error: 'updation failed'
                })
            }   
            res.json(product)
        })
    })
}

//middleware
const photo = (req, res, next) =>{
    if (req.product.photo.data) {
        // res.contentType(req.product.photo.contentType)
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
};


//delete controller
const deleteProduct = (req, res) => {
    let product = req.product;
    product.deleteOne((error, deleteProduct) => {
        if(error){
            return res.satus(400).json({
                error: "not able to delete the product"
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
    .select("-photo")
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((error, products) => {
        if(error){
            return res.status(404).json({
                error: "no products found"
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
    Product.bulkWrite(myOperations, {}, (error, products) => {
        if(error){
            return res.status(400).json({
                error: "bulk operation failed"
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
    updateStock,
    
})