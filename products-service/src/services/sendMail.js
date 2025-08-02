
const constants = require('../constants/constants');
const nodemailer = require('nodemailer');
const {send} = require("express/lib/response");
const {getUserDetailsById} = require("./getUserDetailsById");
const {getProductById} = require("./getProductById");
const getTicketById = require("./getTicketById");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

function setMailContext(email, subject, message) {
    return {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: message,
    };
}


const sendBookingMail = async (product_id, user_id) => {
    let user, product, owner;
    let renterEmail, ownerEmail;

    try {
        user = await getUserDetailsById(user_id);
        product = await getProductById(product_id);
        owner = await getUserDetailsById(product.data[0].owner_id);
        renterEmail = user[0].email;
        ownerEmail = owner[0].email;
    } catch (e) {
        console.error('Error fetching user or product details:', e);
        return false; // Early return on error
    }

    const title = product.data[0].title;
    const renterMessage = `Your booking is successful for ${title}`;
    const ownerMessage = `Your product ${title} is rented out by ${user[0].username}`;

    // Send email to the renter
    const renterMailContext = setMailContext(renterEmail, 'Booking Successful!!!', renterMessage);
    const ownerMailContext = setMailContext(ownerEmail, 'Product Rented Out!!!', ownerMessage);

    try {
        const renterResponse = await sendMail(renterMailContext);
        const ownerResponse = await sendMail(ownerMailContext);
        if (renterResponse.error || ownerResponse.error) {
            console.error('Failed to send mail:', renterResponse.error, ownerResponse.error);
            return false;
        }
        console.log('Mail sent successfully:', renterResponse.info, ownerResponse.info);
        return true; // Success
    } catch (err) {
        console.error('Failed to send mail:', err);
        return false;
    }
};

const sendTicketNotificationToOwner = async (ticket_id, owner_id) => {
    let owner, ticket;

    try {
        // Fetch owner details
        owner = await getUserDetailsById(owner_id);
        if (!owner) {
            console.error('Owner not found');
            return false;
        }
        ownerEmail = owner[0].email;

        // Fetch ticket details
        ticket = await getTicketById(ticket_id);
        console.log(ticket);
        if (!ticket) {
            console.error('Ticket not found');
            return false;
        }

    } catch (error) {
        console.error('Error fetching details:', error);
        return false;
    }

    // Construct the email message based on the ticket details
    const subject = `Ticket Update: ${ticket.products.title}`;
    const message = `Hello ${owner[0].username},\nThere is a complaint regarding your product titled "${ticket.products.title}":\n${ticket.description}\n\nPlease review it at your earliest convenience.\n\nBest regards,\nYour Support Team`;

    // Prepare mail context
    const mailContext = setMailContext(ownerEmail, subject, message);

    // Send the email
    return sendMail(mailContext);
};


async function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Mail sending error:', error);
                resolve({ error });
            } else {
                console.log('Mail sent:', info);
                resolve({ info });
            }
        });
    });
}

module.exports = {sendBookingMail,sendTicketNotificationToOwner};
