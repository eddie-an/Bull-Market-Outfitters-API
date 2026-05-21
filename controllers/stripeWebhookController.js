require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { fulfillCheckoutSession } = require("../services/fulfillmentService");

const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await fulfillCheckoutSession(event.data.object);
                break;
            default:
                console.log(`Unhandled Stripe event type: ${event.type}`);
        }
    } catch (error) {
        console.error(`Error handling Stripe event ${event.type}:`, error.message);
        return res.status(500).json({ error: "Webhook handler failed" });
    }

    res.json({ received: true });
};

module.exports = { handleStripeWebhook };
