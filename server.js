// configure environment variables
require("dotenv").config();

// import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import routes
const stripeRoutes = require('./routes/stripeRouter');
const productRoutes = require('./routes/productRouter');
const orderRoutes = require('./routes/orderRouter');
const sendgridRoutes = require('./routes/sendgridRouter');


// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

// configure routes
app.use('/stripe' ,stripeRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/sendgrid', sendgridRoutes);

app.get('/healthcheck', async (req, res) => {
    res.status(200).send({message: "Health Check"});
});

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        const PORT = process.env.SERVER_PORT || 5000;
        app.listen(PORT); // listean for requests
    })
    .catch((error)=> {
        console.log(error)
    });

