const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getStats,
    getComplaints,
    broadcastNotification
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, verifyAdmin);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Statistics
router.get("/stats", getStats);

// Complaints
router.get("/complaints", getComplaints);

// Notifications
router.post("/notify", broadcastNotification);

module.exports = router;
