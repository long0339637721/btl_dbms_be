require('dotenv').config();
const nodemailer = require('nodemailer');

function sendEmail(to, subject, text, html) {
  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var mainOptions = {
    from: 'Phone store',
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log('Err send mail: ', err);
    } else {
      console.log('Message sent: ', info.response);
    }
  });
}

module.exports = sendEmail;
