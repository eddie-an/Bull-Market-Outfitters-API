require("dotenv").config();

const express = require('express');
const router = express.Router();
const {createCheckoutSession, getCheckoutSession} = require("../controllers/stripeController");
const { handleStripeWebhook } = require('../controllers/stripeWebhookController');

// Stripe webhooks require the raw body for signature verification.
// This route catches the request BEFORE the JSON parser middleware below it.
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.use(express.json()); // Any routes defined BELOW this line will automatically use express.json()
router.post('/create-checkout-session', createCheckoutSession);

router.get('/checkout/session/:sessionId', getCheckoutSession); 



module.exports = router;
