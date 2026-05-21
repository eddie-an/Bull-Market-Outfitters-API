const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const { sendReceiptEmail } = require("../controllers/sendgridController");

const parseItemsFromSession = (session) => {
    if (!session.metadata?.items) {
        throw new Error("Checkout session is missing item metadata");
    }
    return JSON.parse(session.metadata.items);
};

const updateStockForItems = async (items) => {
    const failures = [];

    for (const item of items) {
        const result = await Product.findOneAndUpdate(
            { _id: item.id, quantityInStock: { $gte: item.quantity } },
            { $inc: { quantityInStock: -item.quantity } }
        );

        if (!result) {
            failures.push(item.id);
        }
    }

    if (failures.length > 0) {
        throw new Error(`Insufficient stock for product(s): ${failures.join(", ")}`);
    }
};

const fulfillCheckoutSession = async (session) => {
    const items = parseItemsFromSession(session);
    const orderId = session.id;

    let order = await Order.findOne({ order_id: orderId });

    if (!order) {
        order = await Order.create({
            order_id: orderId,
            session,
            items,
            isStockUpdated: false,
        });
    }

    if (order.isStockUpdated) {
        return { order, skipped: true };
    }

    await updateStockForItems(items);

    const recipient = session.customer_details?.email;
    if (recipient) {
        try {
            await sendReceiptEmail(recipient, items, session);
        } catch (error) {
            console.error(`Receipt email failed for order ${orderId}:`, error.message);
        }
    } else {
        console.warn(`No customer email on checkout session ${orderId}`);
    }

    const fulfilledOrder = await Order.findOneAndUpdate(
        { order_id: orderId, isStockUpdated: false },
        { isStockUpdated: true },
        { new: true }
    );

    if (!fulfilledOrder) {
        const existing = await Order.findOne({ order_id: orderId });
        return { order: existing, skipped: true };
    }

    return { order: fulfilledOrder, skipped: false };
};

module.exports = { fulfillCheckoutSession, parseItemsFromSession };
