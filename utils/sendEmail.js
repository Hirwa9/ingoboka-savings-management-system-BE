import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',  // or any other service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, htmlContent, text, replyTo) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent, // HTML content (optional)
        text: text || htmlContent.replace(/<[^>]*>/g, ''), // Fallback to plain text if provided or auto-generate from HTML
        replyTo
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to: ', to);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

export default sendEmail;