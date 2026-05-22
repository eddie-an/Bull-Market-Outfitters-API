require("dotenv").config();

const express = require('express');
const router = express.Router();
const {createCheckoutSession, getCheckoutSession} = require("../controllers/stripeController");
const { handleStripeWebhook } = require('../controllers/stripeWebhookController');

router.post('/create-checkout-session', createCheckoutSession);

router.get('/checkout/session/:sessionId', getCheckoutSession); 

// Stripe webhooks require the raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
