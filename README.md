# ShopEaseStripeAPI
Stripe Payment API Gateway for ShopEase application

### Project description
This repository contains server side code of the ShopEase application. The front end code is in another repository called shopEase.

This application uses the following stack, API integrations, and tools:
- MongoDB for backend
- Express.js for creating API
- React.js for front end
- Node.js for running JavaScript in a server-side environment
- Stripe for handling payments
- Sendgrid for sending emails

The web site and the APIs are hosted on [Render](https://render.com/).

Because the free tier is used, Render spins down any resources that hasn't been used for 15 minutes. This means that when the web page is first loaded after at least 15 minutes of inactivity, there is a delay in fetching data using the API.

To prevent the delay, [Cron-job](https://cron-job.org/en/) is used to ping the API every 10 minutes to keep it awake. 


### Running in development environment
- Start the server by running the following commands
    - `npm install` to install dependencies such as nodemon, cors, dotenv, express, and stripe (if it's the first time running this project)
    - `npm start` or `npm nodemon server.js`

*Note that the running the server in development might have issues as environment variables need to be configured. API keys for Stripe, MongoDB, and Sendgrid must be configured. Not included in the repository for obvious reasons.