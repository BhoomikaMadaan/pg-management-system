const express    = require("express");
const router     = express.Router();
const { createOrder, verifyPayment } = require("../controllers/razorpayController");
const { verifyToken } = require("../middleware/auth");

router.post("/razorpay/order",  verifyToken, createOrder);
router.post("/razorpay/verify", verifyToken, verifyPayment);

module.exports = router;
