const Product = require("../models/product");
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');


const getProductId = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                err: 'no product found'
            })
        }
        req.product = product
        next()
    })
}

const getProduct = (req, res) => {
    return res.json(req.profile)
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
        product.save((err, product) =>{
            if(err){
                res.status(400).json({
                    error: 'updation of failed'
                })
            }
            res.json(product)
        })
    })
}


const deleteProduct = (req, res) => {
    let product = req.product;
    product.deleteOne((err, deleteProduct) => {
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

module.exports = ({
    getProductId,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
})