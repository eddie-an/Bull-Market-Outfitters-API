require("dotenv").config();

const express = require('express');
const router = express.Router();
const {healthcheck, createCheckoutSession} = require("../controllers/stripeController");

router.get('/healthcheck', healthcheck);

router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
