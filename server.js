// configure environment variables
require("dotenv").config();

// import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import routes
const stripeRoutes = require('./routes/stripeRouter');
const databaseRoutes = require('./routes/databaseRouter');
const sendgridRoutes = require('./routes/sendgridRouter');


// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

// configure routes
app.use('/stripe' ,stripeRoutes);
app.use('/api', databaseRoutes);
app.use('/sendgrid', sendgridRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        const PORT = process.env.SERVER_PORT || 5000;
        app.listen(PORT); // listean for requests
    })
    .catch((error)=> {
        console.log(error)
    });

