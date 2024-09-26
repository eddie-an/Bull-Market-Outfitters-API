require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Product = require("../models/productModel");

const configureCheckoutSession = (requestBody, storeItems) => {
  const expiresAt = Math.floor(Date.now() / 1000) + (30 * 60); // 30 minutes in the future

  const configuration = {
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: requestBody.items.map(item => {
        // Find the product in the storeItems array by matching the item ID
        const storeItem = storeItems.find(product => product._id.toString() === item.id);
        if (!storeItem) {
            throw new Error(`Product with ID ${item.id} not found`);
        }
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: storeItem.name
                },
                unit_amount: storeItem.priceInCents,
                tax_behavior: 'exclusive',
            },
            quantity: item.quantity,
        };
    }),

    shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'],
    },
    shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard Shipping',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500,
              currency: 'usd',
            },
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
            shipping_rate_data: {
              display_name: 'Express Shipping',
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1499,
                currency: 'usd',
              },
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 2,
                },
              },
            },
          },
          {
            shipping_rate_data: {
              display_name: 'Free Shipping',
              type: 'fixed_amount',
              fixed_amount: {
                amount: 0,
                currency: 'usd',
              },
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 14,
                },
                maximum: {
                  unit: 'business_day',
                  value: 21,
                },
              },
            },
          },
    ],
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: {
        items: JSON.stringify(requestBody.items.map(item => {
            const storeItem = storeItems.find(product => product._id.toString() === item.id);
            return {
                id: item.id,
                quantity: item.quantity,
                name: storeItem.name, // Include the product name here
                priceInCents: storeItem.priceInCents
            };
        }))
    },
    expires_at: expiresAt // Set expiration time to 30 minutes
  } // End of configuration JSON file

  return configuration;
}

const createCheckoutSession = async (req, res) => {
    try {

        // Fetch all products from the database
        const storeItems = await Product.find({}).sort({ createdAt: -1 });

        // call a function to set up config parameters for stripe checkout session
        const configuration = configureCheckoutSession(req.body, storeItems);

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create(configuration);

        res.json({ url: session.url });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
}


const getCheckoutSession = async (req, res) => {
    const { sessionId } = req.params;
    
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const items = JSON.parse(session.metadata.items); // Retrieve and parse the stored items
      res.json({ session, items });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error.message);
    }
}

  

module.exports = {createCheckoutSession, getCheckoutSession};