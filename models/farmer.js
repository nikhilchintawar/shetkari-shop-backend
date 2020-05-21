const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;


const farmerSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User"
    },
    farmArea: {
        type: Number,
        required: true
    },
    sellingProductCategory: {
        category: {
            type: ObjectId,
            ref: "Category"
        },
        sellingCategory: {
            default: "",
            enum: ["Grains", "Vegetables", "Both"]
        }
    }
})

module.exports = mongoose.model("Farmer", farmerSchema)