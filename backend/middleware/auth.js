const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ message: "Access token required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

// Middleware to verify owner or admin
const verifyOwner = (req, res, next) => {
    if (!["owner", "admin"].includes(req.user?.role)) {
        return res.status(403).json({ message: "Owner/Admin access required" });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin, verifyOwner };
