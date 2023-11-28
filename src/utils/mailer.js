require("dotenv").config({path: require('find-config')('.env') });
const sgMail = require('@sendgrid/mail')

function sendEmail (to, subject, text, html){
    const api = process.env.SENDGRID_API_KEY1 + '.' + process.env.SENDGRID_API_KEY2 + '.' + process.env.SENDGRID_API_KEY3;
    sgMail.setApiKey(api);
    const msg = {
    to: to, // Change to your recipient
    from: {name: "Easy Electrolic",
        email: process.env.EMAIL}, // Change to your verified sender
    subject: subject,
    text: text,
    html: html,
    }
    sgMail.send(msg).then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

module.exports = sendEmail;
