require("dotenv").config();

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


const storeItems = new Map([
    [1, {priceInCents: 60499, name: "Mid-Century Modern Wide Dresser"}],
    [2, {priceInCents: 1499, name: "Artifical White Orchid"}],
])

router.get('/healthcheck', async (req, res) => {
    res.status(200).send({message: "Health Check"});
})

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item=> {
                const storeItem = storeItems.get(item.id);
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        })
        res.json({ url: session.url}) 
    }
    catch (e){
        res.status(500).json({error: e.message})
    }
})

module.exports = router;