require("dotenv").config();

const express = require('express');
const router = express.Router();
const {sendReceiptViaEmail} = require("../controllers/sendgridController");

router.use(express.json());
router.post('/receipt', sendReceiptViaEmail);

module.exports = router;