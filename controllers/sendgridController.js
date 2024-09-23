require("dotenv").config();
const sgMail = require('@sendgrid/mail')


const sendReceiptViaEmail = async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: req.body.recipient,
        from: {
            name: "ShopEase",
            email: 'edward.an03@gmail.com' // Make sure this email is verified
        },
        subject: `ShopEase order number #${req.body.session.id}`,
        text: generateTextReceipt(req.body.items, req.body.session),
        html: generateHtmlReceipt(req.body.items, req.body.session)
    };
    
    try {
        await sgMail.send(msg);
        console.log('Email sent');
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
    return `Thank you for your purchase!\n\nItems Purchased:\n${itemList}\n\nTotal: $${(session.amount_total / 100).toFixed(2)}`;
}

// Function to generate the HTML format of the receipt
function generateHtmlReceipt(items, session) {
    let itemList = items.map(item => `<li>${item.name}: ${item.quantity} x $${(item.priceInCents / 100).toFixed(2)}</li>`).join('');
    
    return `
        <p>Thank you for your purchase!</p>
        <h2>Items Purchased:</h2>
        <ul>${itemList}</ul>
        <p>Total: $${(session.amount_total / 100).toFixed(2)}</p>
    `;
}



module.exports = {sendReceiptViaEmail};