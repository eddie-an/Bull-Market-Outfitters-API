require("dotenv").config();

const express = require('express');
const router = express.Router();
const {healthcheck, createCheckoutSession, getCheckoutSession} = require("../controllers/stripeController");

router.get('/healthcheck', healthcheck);

router.post('/create-checkout-session', createCheckoutSession);

router.get('/checkout/session/:sessionId', getCheckoutSession); 

module.exports = router;
