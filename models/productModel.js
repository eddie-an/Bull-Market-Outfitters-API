const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    priceInCents: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    altDescription: {
        type: String,
        required: true
    },
    quantityInStock: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, { timeseries: true })


module.exports = mongoose.model("product", productSchema);