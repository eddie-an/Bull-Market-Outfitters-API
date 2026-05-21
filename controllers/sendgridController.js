require("dotenv").config();
const sgMail = require('@sendgrid/mail')


const sendReceiptEmail = async (recipient, items, session) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: recipient,
        from: {
            name: "Bull Market Outfitters",
            email: 'impactsoccer05@gmail.com' // Make sure this email is verified
        },
        subject: `Bull Market Outfitters order number #${session.id}`,
        text: generateTextReceipt(items, session),
        html: generateHtmlReceipt(items, session)
    };

    await sgMail.send(msg);
    console.log('Email sent');
};

const sendReceiptViaEmail = async (req, res) => {
    try {
        await sendReceiptEmail(req.body.recipient, req.body.items, req.body.session);
        res.status(200).send({ message: "Email sent" });
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SendGrid Error Details:', error.response.body.errors);
            res.status(400).send({ message: 'Error sending email', errors: error.response.body.errors });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};



// Function to generate the text format of the receipt
function generateTextReceipt(items, session) {
    let itemList = items.map(item => `${item.name}: ${item.quantity} x $${(item.priceInCents / 100).toFixed(2)}`).join('\n');
    const shippingCost = (session.shipping_cost?.amount_total ?? 0) / 100;
    return `Thank you for your purchase!\n\nItems Purchased:\n${itemList}\n\nSubtotal: $${(session.amount_subtotal / 100).toFixed(2)}
    \nShipping cost: $${shippingCost.toFixed(2)}\nTotal: $${(session.amount_total / 100).toFixed(2)}`;
}

// Function to generate the HTML format of the receipt
function generateHtmlReceipt(items, session) {
    let itemList = items.map(item => `<li>${item.name}: ${item.quantity} x $${(item.priceInCents / 100).toFixed(2)}</li>`).join('');
    
    return `
        <p>Thank you for your purchase!</p>
        <h2>Items Purchased:</h2>
        <ul>${itemList}</ul>
        <p>Subtotal: $${(session.amount_subtotal / 100).toFixed(2)}</p>
        <p>Shipping cost: $${((session.shipping_cost?.amount_total ?? 0) / 100).toFixed(2)}</p>
        <p>Total: $${(session.amount_total / 100).toFixed(2)}</p>
    `;
}



module.exports = { sendReceiptViaEmail, sendReceiptEmail };