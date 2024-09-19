require("dotenv").config()

const express = require('express');

const {
    addProduct,
    getAllProducts,
    changeQuantity
} = require("../controllers/productController");

const router = express.Router();

router.post('/add-product', addProduct);

router.get('/get-all-products', getAllProducts);

router.patch('/change-quantity/:id', changeQuantity);

module.exports = router;