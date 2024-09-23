const Product = require("../models/productModel");
const mongoose = require("mongoose");

// Adds product to database
const addProduct = async (req, res) => {
    const { name, priceInCents, description, altDescription, quantityInStock, image } = req.body;
    try {
        const product = await Product.create({name, priceInCents, description, altDescription, quantityInStock, image});
        res.status(200).json({message: product})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Retrieves all products from database
const getAllProducts = async (req, res) => {
    const products = await Product.find({}).sort({createdAt: -1});
    return res.status(200).json({message: products});
}


// Updates quantity of product from database
const changeQuantity = async (req, res) => {
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "Product doesn't exist"})
    }
    const product = await Product.findOneAndUpdate({_id: id}, {...req.body})

    if (!product) {
        return res.status(400).json({error: "Product doesn't exist"})
    }

    res.status(200).json({message: product});
}

// Retrieves a single product by id
const getProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid product ID" });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    changeQuantity,
    getProduct
}