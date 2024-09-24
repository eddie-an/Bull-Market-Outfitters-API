require("dotenv").config()

const express = require('express');

const {
    addProduct,
    getAllProducts,
    updateProduct,
    getProduct
} = require("../controllers/productController");

const router = express.Router();

router.post('/add-product', addProduct);

router.get('/get-all-products', getAllProducts);

router.get('/get-product/:id', getProduct);

router.patch('/update-product/:id', updateProduct);

module.exports = router;