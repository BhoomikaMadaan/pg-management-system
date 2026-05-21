const User = require("../models/User");
const Complaint = require("../models/Complaint");
const Payment = require("../models/Payment");
const Room = require("../models/Room");

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]]
        });
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!["admin", "owner", "tenant"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ role });
        res.json({ message: "User role updated", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get system statistics (admin only)
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const adminCount = await User.count({ where: { role: "admin" } });
        const ownerCount = await User.count({ where: { role: "owner" } });
        const tenantCount = await User.count({ where: { role: "tenant" } });
        const totalRooms = await Room.count();
        const bookedRooms = await Room.count({ where: { isBooked: true } });
        const totalComplaints = await Complaint.count();
        const openComplaints = await Complaint.count({ where: { status: "open" } });
        const totalPayments = await Payment.count();
        const paidPayments = await Payment.sum("amount", { where: { status: "paid" } });
        const duePayments = await Payment.sum("amount", { where: { status: "due" } });

        res.json({
            users: { total: totalUsers, admin: adminCount, owner: ownerCount, tenant: tenantCount },
            rooms: { total: totalRooms, booked: bookedRooms, available: totalRooms - bookedRooms },
            complaints: { total: totalComplaints, open: openComplaints },
            payments: { total: totalPayments, paidAmount: paidPayments || 0, dueAmount: duePayments || 0 }
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get complaints (admin/owner can see all or their own)
const getComplaints = async (req, res) => {
    try {
        const where = req.user.role === "admin" ? {} : { userId: req.user.id };
        const complaints = await Complaint.findAll({ where, order: [["createdAt", "DESC"]] });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Broadcast notification to all users
const broadcastNotification = async (req, res) => {
    try {
        const { title, message, type } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ message: "Title and message required" });
        }

        // This will be emitted through Socket.io
        res.json({ 
            message: "Notification will be broadcasted",
            notification: { title, message, type: type || "info", timestamp: new Date() }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { 
    getAllUsers, 
    getUserById, 
    updateUserRole, 
    deleteUser, 
    getStats,
    getComplaints,
    broadcastNotification
};
