require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Product = require("../models/productModel");

const healthcheck = async (req, res) => {
    res.status(200).send({message: "Health Check"});
}

const createCheckoutSession = async (req, res) => {
    try {

        // Fetch all products from the database
        const storeItems = await Product.find({}).sort({ createdAt: -1 });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                // Find the product in the storeItems array by matching the item ID
                const storeItem = storeItems.find(product => product._id.toString() === item.id);

                if (!storeItem) {
                    throw new Error(`Product with ID ${item.id} not found`);
                }

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = {healthcheck, createCheckoutSession};