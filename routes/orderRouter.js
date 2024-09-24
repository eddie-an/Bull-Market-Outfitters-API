require("dotenv").config()

const express = require('express');

const {
    addOrder,
    getAllOrders,
    updateOrder,
    getOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post('/add-order', addOrder);

router.get('/get-all-orders', getAllOrders);

router.get('/get-order/:order_id', getOrder);

router.patch('/update-order/:order_id', updateOrder);

module.exports = router;