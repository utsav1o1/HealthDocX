// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
        port: process.env.EMAIL_PORT, // e.g., 587
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS  // Your email password or app-specific password
        }
    });

    // Define email options
    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`, // Sender address
        to: options.to, // List of recipients
        subject: options.subject, // Subject line
        text: options.text || null, // Plain text body
        html: options.html || null // HTML body
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
