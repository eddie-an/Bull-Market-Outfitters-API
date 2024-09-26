require("dotenv").config();

const express = require('express');
const router = express.Router();
const {createCheckoutSession, getCheckoutSession} = require("../controllers/stripeController");

router.post('/create-checkout-session', createCheckoutSession);

router.get('/checkout/session/:sessionId', getCheckoutSession); 

module.exports = router;
