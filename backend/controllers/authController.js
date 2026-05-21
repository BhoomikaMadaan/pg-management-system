const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register - Create user account
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: "Password must contain both letters and numbers" });
        }
        if (!role || !["owner", "tenant"].includes(role)) {
            return res.status(400).json({ message: "Valid role (owner/tenant) is required" });
        }

        // Check if email already exists
        const existing = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Generate OTP for future use
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user - verified by default to allow login immediately
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "tenant",
            otp,
            otpExpiry,
            isVerified: true  // Auto-verified to allow immediate login
        });

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        console.log(`✅ User registered successfully: ${email}`);

        res.status(201).json({
            message: "Account created successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Find user by email (case-insensitive)
        const user = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        console.log(`✅ User logged in: ${email}`);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error during login" });
    }
};

// Verify OTP (optional - for future email verification)
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Mark user as verified
        await user.update({
            isVerified: true,
            otp: null,
            otpExpiry: null
        });

        console.log(`✅ User verified: ${email}`);

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.json({
            message: "Email verified successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("OTP verification error:", err.message);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.update({
            otp,
            otpExpiry
        });

        console.log(`✅ OTP resent to: ${email}, OTP: ${otp}`);

        res.json({ message: "OTP has been generated (check console for testing)" });
    } catch (err) {
        console.error("Resend OTP error:", err.message);
        res.status(500).json({ message: "Server error during OTP resend" });
    }
};

module.exports = { login, register, verifyOTP, resendOTP };
