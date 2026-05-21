# Bull Market Outfitters API
API Gateway for Bull Market Outfitters application

### Project description
This repository contains server side code of the ShopEase application. The front end code is in another repository called [Bull-Market-Outfitters](https://github.com/eddie-an/Bull-Market-Outfitters).

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

### Stripe webhooks (post-checkout fulfillment)

After a customer pays, Stripe sends a `checkout.session.completed` event to `POST /stripe/webhook`. The server then:

1. Saves the order to MongoDB
2. Decrements product stock
3. Sends the receipt email via SendGrid

This runs server-side so fulfillment still happens if the user closes the browser after checkout.

**Environment variables**

| Variable | Purpose |
|----------|---------|
| `STRIPE_WEBHOOK_SECRET` | Signing secret from the Stripe webhook endpoint |

**Local development with Stripe CLI**

```bash
stripe listen --forward-to localhost:<SERVER_PORT>/stripe/webhook
```
> where SERVER_PORT is the port number defined in the .env file

Copy the webhook signing secret the CLI prints and set it as `STRIPE_WEBHOOK_SECRET`.

**Production (Render)**

1. In [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks), add endpoint: `https://<your-api-host>/stripe/webhook`
2. Subscribe to `checkout.session.completed`
3. Add the signing secret to Render as `STRIPE_WEBHOOK_SECRET`

**Checkout flow (client)**

1. `POST /stripe/create-checkout-session` — validates stock server-side, creates the Stripe session, returns `{ url }`.
2. User pays on Stripe and lands on `/success?session_id=...`.
3. `GET /stripe/checkout/session/:sessionId` — read-only: returns the Stripe session, line items, and `fulfillment.status` from the order record. The success page polls this endpoint until the webhook marks fulfillment complete (or times out).

Fulfillment (order, stock, email) runs only in the `checkout.session.completed` webhook handler. The frontend never triggers it.

**Admin / legacy endpoints**

`POST /order/add-order`, `PATCH /product/update-product/:id`, and `POST /sendgrid/receipt` remain on the API for tooling or admin use; the React app no longer calls them after checkout.
