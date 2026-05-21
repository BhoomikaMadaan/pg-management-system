const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOTPEmail = async (email, otp, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Your OTP for PG Management System Registration",
            html: `
                <h2>Welcome to PG Management System!</h2>
                <p>Hi ${name},</p>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP will expire in <strong>10 minutes</strong>.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br/>
                <p>Best regards,<br/>PG Management Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${email}`);
        return true;
    } catch (err) {
        console.error(`❌ Error sending OTP email to ${email}:`, err);
        return false;
    }
};

module.exports = { sendOTPEmail };
