const Order = require("../models/orderModel");
const mongoose = require("mongoose");

// Adds an order to database
const addOrder = async (req, res) => {
    const { order_id, session, items, isStockUpdated } = req.body;
    try {
        const order = await Order.create({order_id, session, items, isStockUpdated});
        res.status(200).json({message: order})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Retrieves all orders from database
const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).sort({createdAt: -1});
    return res.status(200).json({message: orders});
}


// Updates isStockUpdated flag of a particular order from database
const updateOrder = async (req, res) => {
    const {order_id} = req.params;
    
    const order = await Order.findOneAndUpdate({order_id: order_id}, {...req.body})

    if (!order) {
        return res.status(400).json({error: "Order doesn't exist"})
    }

    res.status(200).json({message: order});
}

// Retrieves a single order by id
const getOrder = async (req, res) => {
    const { order_id } = req.params;

    try {
        const order = await Order.find({order_id: order_id});

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addOrder,
    getAllOrders,
    updateOrder,
    getOrder
}