require("dotenv").config()

const express = require('express')
const app = express()
const cors = require('cors')
const stripeRoutes = require('./routes/stripe')

app.use(express.json())

app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/stripe' ,stripeRoutes);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT)